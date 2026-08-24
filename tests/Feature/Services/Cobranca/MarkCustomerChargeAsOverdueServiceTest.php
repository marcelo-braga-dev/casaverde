<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;
use App\Services\Cobranca\MarkCustomerChargeAsOverdueService;

describe('MarkCustomerChargeAsOverdueService', function () {

    beforeEach(function () {
        $this->service = app(MarkCustomerChargeAsOverdueService::class);
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('marks an open charge as overdue', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        $updated = $this->service->handle($charge);

        expect($updated->status)->toBe('overdue');
    });

    it('marks a waiting_payment charge as overdue', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'waiting_payment']);

        $updated = $this->service->handle($charge);

        expect($updated->status)->toBe('overdue');
    });

    it('throws for a draft charge', function () {
        $charge = CustomerCharge::factory()->draft()->create();

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Apenas cobranças abertas podem ser marcadas como atrasadas.');
    });

    it('throws for an already paid charge', function () {
        $charge = CustomerCharge::factory()->paid()->create();

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class);
    });

    it('logs a history entry', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $this->service->handle($charge);

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'user_id' => $this->admin->id,
            'action' => 'marked_overdue',
            'description' => 'Marcada como atrasada manualmente.',
        ]);
    });

});
