<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Cobranca\UpdateCustomerChargeDueDateService;

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

    it('allows updating the due date even when the charge has an active payment slip', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open', 'due_date' => '2026-08-10']);
        PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'status' => 'generated',
        ]);

        $result = $this->service->handle($charge, '2026-09-15');

        expect($result->due_date->format('Y-m-d'))->toBe('2026-09-15');
    });

});
