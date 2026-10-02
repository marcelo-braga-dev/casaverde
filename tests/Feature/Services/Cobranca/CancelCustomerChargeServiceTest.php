<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Cobranca\CancelCustomerChargeService;
use Illuminate\Support\Facades\Http;

describe('CancelCustomerChargeService', function () {

    beforeEach(function () {
        $this->service = app(CancelCustomerChargeService::class);
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('cancels an open charge', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        $updated = $this->service->handle($charge, 'Cliente pediu cancelamento');

        expect($updated->status)->toBe('cancelled')
            ->and($updated->cancelled_at)->not->toBeNull()
            ->and($updated->notes)->toContain('Cliente pediu cancelamento');
    });

    it('cancels the active payment slips at the provider along with the charge', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-1' => Http::response([], 204),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => PaymentProviderAccount::factory()->create(['base_url' => 'https://cora.test'])->id,
            'provider_payment_id' => 'inv-1',
            'status' => 'generated',
        ]);

        $this->service->handle($charge);

        expect($slip->fresh()->status)->toBe('cancelled');
        Http::assertSent(fn ($request) => $request->method() === 'DELETE' && str_ends_with($request->url(), '/invoices/inv-1'));
    });

    it('keeps the charge active when the provider refuses to cancel a still payable slip', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-2' => Http::sequence()
                ->push(['error' => 'unavailable'], 503)
                ->push(['id' => 'inv-2', 'status' => 'OPEN'], 200),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => PaymentProviderAccount::factory()->create(['base_url' => 'https://cora.test'])->id,
            'provider_payment_id' => 'inv-2',
            'status' => 'generated',
        ]);

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Não foi possível cancelar o pagamento no provider.');

        expect($charge->refresh()->status)->toBe('open')
            ->and($slip->refresh()->status)->toBe('generated');
    });

    it('cancels locally a slip that never reached the provider', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider_payment_id' => null,
            'status' => 'pending',
        ]);

        $this->service->handle($charge);

        expect($slip->fresh()->status)->toBe('cancelled')
            ->and($charge->refresh()->status)->toBe('cancelled');
    });

    it('does not touch a payment slip that is already paid', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->paid()->create(['customer_charge_id' => $charge->id]);

        // Cobrança com slip pago não deveria, na prática, chegar aqui — mas o service
        // não deve tocar num slip já pago mesmo que a charge seja cancelada de qualquer forma.
        $this->service->handle($charge);

        expect($slip->fresh()->status)->toBe('paid');
    });

    it('throws when the charge is already paid', function () {
        $charge = CustomerCharge::factory()->paid()->create();

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Não é possível cancelar uma cobrança já paga.');
    });

    it('throws when the charge is already cancelled', function () {
        $charge = CustomerCharge::factory()->cancelled()->create();

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Esta cobrança já está cancelada.');
    });

    it('logs a history entry with the reason', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $this->service->handle($charge, 'Duplicidade');

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'user_id' => $this->admin->id,
            'action' => 'cancelled',
            'description' => 'Cobrança cancelada. Motivo: Duplicidade',
        ]);
    });

    it('logs a generic history entry when no reason is given', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $this->service->handle($charge);

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'action' => 'cancelled',
            'description' => 'Cobrança cancelada.',
        ]);
    });

});
