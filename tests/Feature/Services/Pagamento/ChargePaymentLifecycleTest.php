<?php

use App\Exceptions\Payments\PaymentProviderException;
use App\Jobs\MarkChargeAsOverdueJob;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentTransaction;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Cobranca\ApproveCustomerChargeService;
use App\Services\Cobranca\GenerateCustomerChargeFromBillService;
use App\Services\Pagamento\CancelPaymentSlipService;
use App\Services\Pagamento\GeneratePaymentSlipService;
use App\Services\Pagamento\ProcessPaymentWebhookService;
use App\Services\Pagamento\SyncPaymentSlipService;
use Illuminate\Support\Facades\Http;

/**
 * Percorre, de ponta a ponta, todos os fluxos de cobrança/pagamento pedidos:
 * criar fatura -> gerar cobrança -> emitir pagamento -> pagar -> cancelar ->
 * reemitir -> nova fatura após cancelamento -> etc. Usa os services/jobs reais
 * (nada de mock de banco), só a chamada HTTP ao provider é fake.
 */
describe('Charge + Payment lifecycle', function () {

    beforeEach(function () {
        $this->account = PaymentProviderAccount::factory()->create([
            'provider' => 'cora',
            'base_url' => 'https://cora.test',
            'is_active' => true,
            'is_default' => true,
        ]);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
        ]);

        $this->generateCharge = app(GenerateCustomerChargeFromBillService::class);
        $this->approveCharge = app(ApproveCustomerChargeService::class);
        $this->generateSlip = app(GeneratePaymentSlipService::class);
        $this->cancelSlip = app(CancelPaymentSlipService::class);
        $this->syncSlip = app(SyncPaymentSlipService::class);
        $this->processWebhook = app(ProcessPaymentWebhookService::class);
    });

    it('walks the full happy path: bill approved -> charge -> payment issued -> paid via webhook', function () {
        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);

        $charge = $this->generateCharge->handle($bill);
        expect($charge->status)->toBe('draft');

        $charge = $this->approveCharge->handle($charge);
        expect($charge->status)->toBe('open');

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response([
                'id' => 'inv-happy-1',
                'status' => 'OPEN',
                'payment_options' => ['bank_slip' => ['barcode' => '123', 'digitable_line' => '456']],
            ], 201),
        ]);

        $slip = $this->generateSlip->handle($charge);
        expect($slip->status)->toBe('generated')
            ->and($charge->refresh()->status)->toBe('open'); // emitir boleto não muda o status da cobrança

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-happy-1',
            'payload' => ['invoice' => ['id' => 'inv-happy-1', 'status' => 'PAID', 'paid_amount' => (int) ($charge->final_amount * 100)]],
        ]);
        $this->processWebhook->handle($event);

        expect($slip->refresh()->status)->toBe('paid')
            ->and($charge->refresh()->status)->toBe('paid')
            ->and(PaymentTransaction::where('payment_slip_id', $slip->id)->count())->toBe(1);

        // Cobrança paga não aceita novo pagamento.
        expect(fn () => $this->generateSlip->handle($charge->refresh()))
            ->toThrow(InvalidArgumentException::class, 'A cobrança precisa estar aberta para gerar pagamento.');
    });

    it('cancels an issued payment and successfully reissues a new one for the same charge', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            // Duas invoices são criadas nesta ordem ao longo do teste (1ª emissão e a
            // reemissão depois do cancelamento) — Http::fake usa a PRIMEIRA resposta
            // registrada para URLs repetidas, então uma sequence é obrigatória aqui.
            'cora.test/invoices' => Http::sequence()
                ->push(['id' => 'inv-reissue-1', 'status' => 'OPEN'], 201)
                ->push(['id' => 'inv-reissue-2', 'status' => 'OPEN'], 201),
            'cora.test/invoices/inv-reissue-1' => Http::response([], 204),
            'cora.test/invoices/inv-reissue-2' => Http::response(['id' => 'inv-reissue-2', 'status' => 'PAID', 'paid_amount' => 25000], 200),
        ]);

        $firstSlip = $this->generateSlip->handle($charge);

        // Não é possível emitir um segundo pagamento enquanto o primeiro está ativo.
        expect(fn () => $this->generateSlip->handle($charge->refresh()))
            ->toThrow(InvalidArgumentException::class, 'Já existe um pagamento ativo para esta cobrança.');

        $this->cancelSlip->handle($firstSlip);

        expect($firstSlip->refresh()->status)->toBe('cancelled')
            ->and($charge->refresh()->status)->toBe('open');

        $secondSlip = $this->generateSlip->handle($charge->refresh());

        expect($secondSlip->id)->not->toBe($firstSlip->id)
            ->and($secondSlip->provider_payment_id)->toBe('inv-reissue-2')
            ->and($secondSlip->status)->toBe('generated')
            ->and(PaymentSlip::where('customer_charge_id', $charge->id)->count())->toBe(2);

        // A cobrança só reflete o pagamento ATIVO — o cancelado antigo não interfere.
        $this->syncSlip->handle($secondSlip);

        expect($charge->refresh()->status)->toBe('paid')
            ->and($firstSlip->refresh()->status)->toBe('cancelled');
    });

    it('generates an independent new charge from a new bill after the previous charge for the same client was cancelled', function () {
        $oldBill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        $oldCharge = $this->generateCharge->handle($oldBill);
        $oldCharge = $this->approveCharge->handle($oldCharge);
        $oldCharge->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        $newBill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $oldBill->client_profile_id,
            'review_status' => 'approved',
        ]);

        $newCharge = $this->generateCharge->handle($newBill);

        expect($newCharge->id)->not->toBe($oldCharge->id)
            ->and($newCharge->status)->toBe('draft')
            ->and(CustomerCharge::where('client_profile_id', $oldBill->client_profile_id)->count())->toBe(2);

        $newCharge = $this->approveCharge->handle($newCharge);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['id' => 'inv-newbill-1', 'status' => 'OPEN'], 201),
        ]);
        $slip = $this->generateSlip->handle($newCharge);

        expect($slip->customer_charge_id)->toBe($newCharge->id);
    });

    it('cannot generate a second active charge for the same bill while the first one is still active', function () {
        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        $this->generateCharge->handle($bill);

        expect(fn () => $this->generateCharge->handle($bill->fresh()))
            ->toThrow(InvalidArgumentException::class, 'Já existe cobrança gerada para esta fatura.');
    });

    it('allows generating a replacement charge for the same bill once the previous one was cancelled', function () {
        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        $charge = $this->generateCharge->handle($bill);
        $charge->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        $replacement = $this->generateCharge->handle($bill->fresh());

        expect($replacement->id)->not->toBe($charge->id)
            ->and($replacement->status)->toBe('draft')
            ->and($replacement->concessionaire_bill_id)->toBe($bill->id)
            ->and(CustomerCharge::where('concessionaire_bill_id', $bill->id)->count())->toBe(2);

        // A fatura só "vê" a cobrança ativa, não a cancelada antiga.
        expect($bill->fresh()->customerCharge->id)->toBe($replacement->id);
    });

    it('still refuses a replacement charge while the previous one is only overdue, not cancelled', function () {
        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        $charge = $this->generateCharge->handle($bill);
        $charge->update(['status' => 'overdue']);

        expect(fn () => $this->generateCharge->handle($bill->fresh()))
            ->toThrow(InvalidArgumentException::class, 'Já existe cobrança gerada para esta fatura.');
    });

    it('recovers an overdue charge stuck without an active payment: due date passes, payment dies, gets reopened, reissued and paid', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'open',
            'due_date' => now()->addDay()->toDateString(),
        ]);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::sequence()
                ->push(['id' => 'inv-overdue-1', 'status' => 'OPEN'], 201)
                ->push(['id' => 'inv-overdue-2', 'status' => 'OPEN'], 201),
            'cora.test/invoices/inv-overdue-1' => Http::response(['id' => 'inv-overdue-1', 'status' => 'EXPIRED'], 200),
        ]);

        $slip = $this->generateSlip->handle($charge);

        // O vencimento da cobrança passa com o boleto ainda pendente.
        $charge->update(['due_date' => now()->subDays(2)->toDateString()]);
        (new MarkChargeAsOverdueJob($charge->id))->handle();
        expect($charge->refresh()->status)->toBe('overdue');

        // O boleto acaba expirando no provider; o admin sincroniza manualmente.
        $this->syncSlip->handle($slip);

        expect($slip->refresh()->status)->toBe('expired')
            ->and($charge->refresh()->status)->toBe('open'); // reaberta automaticamente

        // Agora dá pra emitir um novo boleto normalmente e pagá-lo.
        $newSlip = $this->generateSlip->handle($charge->refresh());
        expect($newSlip->provider_payment_id)->toBe('inv-overdue-2');

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-overdue-2',
            'payload' => ['invoice' => ['id' => 'inv-overdue-2', 'status' => 'PAID', 'paid_amount' => 25000]],
        ]);
        $this->processWebhook->handle($event);

        expect($newSlip->refresh()->status)->toBe('paid')
            ->and($charge->refresh()->status)->toBe('paid');
    });

    it('allows reissuing after a failed provider attempt without ever touching the charge status', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::sequence()
                ->push(['error' => 'invalid payload'], 422)
                ->push(['id' => 'inv-retry-1', 'status' => 'OPEN'], 201),
        ]);

        expect(fn () => $this->generateSlip->handle($charge))
            ->toThrow(PaymentProviderException::class);

        $failedSlip = PaymentSlip::where('customer_charge_id', $charge->id)->first();
        expect($failedSlip->status)->toBe('failed')
            ->and($charge->refresh()->status)->toBe('open');

        $slip = $this->generateSlip->handle($charge->refresh());

        expect($slip->status)->toBe('generated')
            ->and(PaymentSlip::where('customer_charge_id', $charge->id)->count())->toBe(2);
    });

});
