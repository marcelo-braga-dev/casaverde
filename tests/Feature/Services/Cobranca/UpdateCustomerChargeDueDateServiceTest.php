<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Cobranca\UpdateCustomerChargeDueDateService;
use Illuminate\Support\Facades\Http;

describe('UpdateCustomerChargeDueDateService', function () {

    beforeEach(function () {
        $this->service = app(UpdateCustomerChargeDueDateService::class);
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('updates the due date of an open charge', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'open',
            'due_date' => '2026-08-10',
        ]);

        $result = $this->service->handle($charge, '2026-09-15');

        expect($result->due_date->format('Y-m-d'))->toBe('2026-09-15');
    });

    it('logs a history entry with the old and new dates', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'open',
            'due_date' => '2026-08-10',
        ]);

        $this->service->handle($charge, '2026-09-15');

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'user_id' => $this->admin->id,
            'action' => 'due_date_updated',
            'description' => 'Vencimento alterado de 10/08/2026 para 15/09/2026.',
        ]);
    });

    it('updates the due date of a draft charge', function () {
        $charge = CustomerCharge::factory()->draft()->create(['due_date' => '2026-08-10']);

        $result = $this->service->handle($charge, '2026-09-15');

        expect($result->due_date->format('Y-m-d'))->toBe('2026-09-15');
    });

    it('updates the due date of an overdue charge', function () {
        $charge = CustomerCharge::factory()->overdue()->create(['due_date' => '2026-08-10']);

        $result = $this->service->handle($charge, '2026-09-15');

        expect($result->due_date->format('Y-m-d'))->toBe('2026-09-15');
    });

    it('refuses to update the due date of a paid charge', function () {
        $charge = CustomerCharge::factory()->paid()->create(['due_date' => '2026-08-10']);

        expect(fn () => $this->service->handle($charge, '2026-09-15'))
            ->toThrow(InvalidArgumentException::class, 'Não é possível alterar o vencimento de uma cobrança paga ou cancelada.');

        expect($charge->fresh()->due_date->format('Y-m-d'))->toBe('2026-08-10');
    });

    it('refuses to update the due date of a cancelled charge', function () {
        $charge = CustomerCharge::factory()->cancelled()->create(['due_date' => '2026-08-10']);

        expect(fn () => $this->service->handle($charge, '2026-09-15'))
            ->toThrow(InvalidArgumentException::class, 'Não é possível alterar o vencimento de uma cobrança paga ou cancelada.');
    });

    it('cancels the active slip at the provider and reissues it with the new due date', function () {
        Http::fake([
            'mp.test/v1/orders/inv-old/cancel' => Http::response(mpOrder('inv-old', 'canceled'), 200),
            'mp.test/v1/orders' => Http::response(mpOrder('inv-new', 'action_required'), 201),
        ]);

        $account = mercadoPagoAccount();
        $charge = CustomerCharge::factory()->create(['status' => 'open', 'due_date' => '2026-08-10']);
        $oldSlip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider_payment_id' => 'inv-old',
            'payment_method' => 'pix',
            'status' => 'generated',
        ]);

        $result = $this->service->handle($charge, '2026-09-15');

        $newSlip = $charge->paymentSlips()->where('status', 'generated')->sole();

        expect($result->due_date->format('Y-m-d'))->toBe('2026-09-15')
            ->and($oldSlip->fresh()->status)->toBe('cancelled')
            ->and($newSlip->provider_payment_id)->toBe('inv-new')
            ->and($newSlip->due_date->format('Y-m-d'))->toBe('2026-09-15');
    });

    it('keeps the old due date when the provider refuses to cancel the active slip', function () {
        Http::fake([
            'mp.test/v1/orders/inv-old/cancel' => Http::response(['error' => 'unavailable'], 503),
            'mp.test/v1/orders/inv-old' => Http::response(mpOrder('inv-old', 'action_required'), 200),
        ]);

        $account = mercadoPagoAccount();
        $charge = CustomerCharge::factory()->create(['status' => 'open', 'due_date' => '2026-08-10']);
        PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider_payment_id' => 'inv-old',
            'status' => 'generated',
        ]);

        expect(fn () => $this->service->handle($charge, '2026-09-15'))
            ->toThrow(InvalidArgumentException::class);

        expect($charge->refresh()->due_date->format('Y-m-d'))->toBe('2026-08-10');
    });

    it('applies the change and reports it when the new slip cannot be issued', function () {
        Http::fake([
            'mp.test/v1/orders/inv-old/cancel' => Http::response(mpOrder('inv-old', 'canceled'), 200),
            'mp.test/v1/orders' => Http::response(['error' => 'invalid'], 400),
        ]);

        $account = mercadoPagoAccount();
        $charge = CustomerCharge::factory()->create(['status' => 'open', 'due_date' => '2026-08-10']);
        PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider_payment_id' => 'inv-old',
            'status' => 'generated',
        ]);

        expect(fn () => $this->service->handle($charge, '2026-09-15'))
            ->toThrow(InvalidArgumentException::class, 'o novo não pôde ser emitido');

        expect($charge->refresh()->due_date->format('Y-m-d'))->toBe('2026-09-15');
        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'action' => 'payment_reissue_failed',
        ]);
    });

});
