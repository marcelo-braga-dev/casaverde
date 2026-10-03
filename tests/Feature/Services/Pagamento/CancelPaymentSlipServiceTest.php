<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\CancelPaymentSlipService;
use App\Services\Pagamento\GeneratePaymentSlipService;
use Illuminate\Support\Facades\Http;

describe('CancelPaymentSlipService', function () {

    beforeEach(function () {
        $this->service = app(CancelPaymentSlipService::class);

        $this->account = mercadoPagoAccount();

        Http::fake([
        ]);
    });

    it('cancels an active slip and reopens the charge back to open', function () {
        Http::fake([
            'mp.test/v1/orders/inv-1/cancel' => Http::response(mpOrder('inv-1', 'canceled'), 200),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'mercado_pago',
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
            'mp.test/v1/orders/inv-2/cancel' => Http::response(mpOrder('inv-2', 'canceled'), 200),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'overdue']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'inv-2',
            'status' => 'pending',
        ]);

        $this->service->handle($slip);

        expect($charge->refresh()->status)->toBe('open');
    });

    it('does not touch the charge status when the charge is already paid', function () {
        Http::fake([
            'mp.test/v1/orders/inv-3/cancel' => Http::response(mpOrder('inv-3', 'canceled'), 200),
        ]);

        // Estado forçado (não deveria acontecer na prática: um slip "generated" duplicado
        // numa charge já paga por outro slip), só para garantir que o cancelamento não
        // reabre uma cobrança que já foi legitimamente quitada.
        $charge = CustomerCharge::factory()->create(['status' => 'paid']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'mercado_pago',
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
            'mp.test/v1/orders/inv-4/cancel' => Http::response(['error' => 'cannot cancel'], 422),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'mercado_pago',
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
            'mp.test/v1/orders/inv-5/cancel' => Http::response(mpOrder('inv-5', 'canceled'), 200),
            'mp.test/v1/orders' => Http::response(mpOrder('inv-6', 'action_required'), 201),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $oldSlip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account->id,
            'provider' => 'mercado_pago',
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
