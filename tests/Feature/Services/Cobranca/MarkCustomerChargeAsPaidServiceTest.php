<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Cobranca\MarkCustomerChargeAsPaidService;
use Illuminate\Support\Facades\Http;

describe('MarkCustomerChargeAsPaidService', function () {

    beforeEach(function () {
        $this->service = app(MarkCustomerChargeAsPaidService::class);
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('marks an open charge as paid', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        $updated = $this->service->handle($charge, 'Pago via Pix direto');

        expect($updated->status)->toBe('paid')
            ->and($updated->paid_at)->not->toBeNull()
            ->and($updated->notes)->toContain('Pago via Pix direto');
    });

    it('marks an overdue charge as paid', function () {
        $charge = CustomerCharge::factory()->overdue()->create();

        $updated = $this->service->handle($charge);

        expect($updated->status)->toBe('paid');
    });

    it('throws when the charge is cancelled', function () {
        $charge = CustomerCharge::factory()->cancelled()->create();

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Não é possível pagar uma cobrança cancelada.');
    });

    it('throws when the charge is already paid', function () {
        $charge = CustomerCharge::factory()->paid()->create();

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Esta cobrança já está paga.');
    });

    it('logs a history entry', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $this->service->handle($charge, 'Depósito confirmado');

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'user_id' => $this->admin->id,
            'action' => 'marked_paid',
            'description' => 'Pagamento manual: Depósito confirmado',
        ]);
    });

    it('logs a generic history entry when no note is given', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $this->service->handle($charge);

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'action' => 'marked_paid',
            'description' => 'Cobrança marcada como paga manualmente.',
        ]);
    });

    it('cancels the active slip at the provider so the customer cannot pay twice', function () {
        Http::fake([
            'mp.test/v1/orders/inv-1/cancel' => Http::response(mpOrder('inv-1', 'canceled'), 200),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => mercadoPagoAccount()->id,
            'provider_payment_id' => 'inv-1',
            'status' => 'generated',
        ]);

        $this->service->handle($charge, 'Pago via transferência');

        expect($slip->fresh()->status)->toBe('cancelled')
            ->and($charge->refresh()->status)->toBe('paid');
    });

    it('records the provider payment instead when the slip had already been paid there', function () {
        Http::fake([
            'mp.test/v1/orders/inv-2/cancel' => Http::response(['error' => 'already paid'], 422),
            'mp.test/v1/orders/inv-2' => Http::response(mpOrder('inv-2', 'processed', ['total_paid_amount' => (string) ((25000) / 100)]), 200),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => mercadoPagoAccount()->id,
            'provider_payment_id' => 'inv-2',
            'status' => 'generated',
        ]);

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'O pagamento já havia sido confirmado no provider');

        expect($slip->fresh()->status)->toBe('paid')
            ->and($charge->refresh()->status)->toBe('paid');
    });
});
