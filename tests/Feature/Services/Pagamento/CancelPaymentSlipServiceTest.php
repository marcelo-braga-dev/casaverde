<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\CancelPaymentSlipService;
use App\Services\Pagamento\GeneratePaymentSlipService;
use Illuminate\Support\Facades\Http;

describe('CancelPaymentSlipService', function () {

    beforeEach(function () {
        $this->service = app(CancelPaymentSlipService::class);

        $this->account = PaymentProviderAccount::factory()->create([
            'provider' => 'cora',
            'base_url' => 'https://cora.test',
            'is_active' => true,
            'is_default' => true,
        ]);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
        ]);
    });

    it('cancels an active slip and reopens the charge back to open', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-1' => Http::response([], 204),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-1',
            'status' => 'generated',
        ]);

        $result = $this->service->handle($slip);

        expect($result->status)->toBe('cancelled')
            ->and($result->cancelled_at)->not->toBeNull()
            ->and($charge->refresh()->status)->toBe('open');
    });

    it('reopens an overdue charge back to open when its active slip is cancelled manually', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-2' => Http::response([], 204),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'overdue']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-2',
            'status' => 'pending',
        ]);

        $this->service->handle($slip);

        expect($charge->refresh()->status)->toBe('open');
    });

    it('does not touch the charge status when the charge is already paid', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-3' => Http::response([], 204),
        ]);

        // Estado forçado (não deveria acontecer na prática: um slip "generated" duplicado
        // numa charge já paga por outro slip), só para garantir que o cancelamento não
        // reabre uma cobrança que já foi legitimamente quitada.
        $charge = CustomerCharge::factory()->create(['status' => 'paid']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-3',
            'status' => 'generated',
        ]);

        $this->service->handle($slip);

        expect($charge->refresh()->status)->toBe('paid');
    });

    it('refuses to cancel a slip that is already paid', function () {
        $slip = PaymentSlip::factory()->create(['status' => 'paid']);

        expect(fn () => $this->service->handle($slip))
            ->toThrow(InvalidArgumentException::class, 'Não é possível cancelar um pagamento já pago.');
    });

    it('refuses to cancel a slip that is already cancelled', function () {
        $slip = PaymentSlip::factory()->create(['status' => 'cancelled']);

        expect(fn () => $this->service->handle($slip))
            ->toThrow(InvalidArgumentException::class, 'Este pagamento já está cancelado ou expirado.');
    });

    it('refuses to cancel a slip that is already expired', function () {
        $slip = PaymentSlip::factory()->create(['status' => 'expired']);

        expect(fn () => $this->service->handle($slip))
            ->toThrow(InvalidArgumentException::class, 'Este pagamento já está cancelado ou expirado.');
    });

    it('refuses to cancel a slip without a provider payment id', function () {
        $slip = PaymentSlip::factory()->create(['status' => 'pending', 'provider_payment_id' => null]);

        expect(fn () => $this->service->handle($slip))
            ->toThrow(InvalidArgumentException::class, 'Pagamento sem ID no provider.');
    });

    it('throws when the provider refuses to cancel the payment', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-4' => Http::response(['error' => 'cannot cancel'], 422),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-4',
            'status' => 'generated',
        ]);

        expect(fn () => $this->service->handle($slip))
            ->toThrow(InvalidArgumentException::class, 'Não foi possível cancelar o pagamento no provider.');

        expect($slip->refresh()->status)->toBe('generated')
            ->and($charge->refresh()->status)->toBe('open');
    });

    it('allows generating a brand new slip for the charge after cancelling the previous one', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-5' => Http::response([], 204),
            'cora.test/invoices' => Http::response([
                'id' => 'inv-6',
                'status' => 'OPEN',
            ], 201),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $oldSlip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-5',
            'status' => 'generated',
        ]);

        $this->service->handle($oldSlip);

        $newSlip = app(GeneratePaymentSlipService::class)->handle($charge->refresh());

        expect($newSlip->id)->not->toBe($oldSlip->id)
            ->and($newSlip->provider_payment_id)->toBe('inv-6')
            ->and($newSlip->status)->toBe('generated');
    });

});
