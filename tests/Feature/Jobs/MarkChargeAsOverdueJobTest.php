<?php

use App\Jobs\MarkChargeAsOverdueJob;
use App\Models\Cobranca\CustomerCharge;

describe('MarkChargeAsOverdueJob', function () {

    it('marks an open charge with a past due date as overdue', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'open',
            'due_date' => now()->subDays(3)->toDateString(),
        ]);

        (new MarkChargeAsOverdueJob($charge->id))->handle();

        expect($charge->refresh()->status)->toBe('overdue');

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'user_id' => null,
            'action' => 'marked_overdue',
            'description' => 'Marcada automaticamente como atrasada (vencimento ultrapassado).',
        ]);
    });

    it('marks a waiting_payment charge with a past due date as overdue', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'waiting_payment',
            'due_date' => now()->subDay()->toDateString(),
        ]);

        (new MarkChargeAsOverdueJob($charge->id))->handle();

        expect($charge->refresh()->status)->toBe('overdue');
    });

    it('leaves an open charge with a future due date untouched', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'open',
            'due_date' => now()->addDays(5)->toDateString(),
        ]);

        (new MarkChargeAsOverdueJob($charge->id))->handle();

        expect($charge->refresh()->status)->toBe('open');
    });

    it('does not touch a paid charge even with a past due date', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'paid',
            'due_date' => now()->subDays(3)->toDateString(),
        ]);

        (new MarkChargeAsOverdueJob($charge->id))->handle();

        expect($charge->refresh()->status)->toBe('paid');
    });

    it('does not touch a cancelled charge even with a past due date', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'cancelled',
            'due_date' => now()->subDays(3)->toDateString(),
        ]);

        (new MarkChargeAsOverdueJob($charge->id))->handle();

        expect($charge->refresh()->status)->toBe('cancelled');
    });

    it('is a no-op when the charge is already overdue (does not error on re-run)', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'overdue',
            'due_date' => now()->subDays(3)->toDateString(),
        ]);

        (new MarkChargeAsOverdueJob($charge->id))->handle();

        expect($charge->refresh()->status)->toBe('overdue');
    });

    it('does nothing when the charge no longer exists', function () {
        (new MarkChargeAsOverdueJob(999999))->handle();
    })->throwsNoExceptions();

    it('does nothing for a charge without a due date', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'open',
            'due_date' => null,
        ]);

        (new MarkChargeAsOverdueJob($charge->id))->handle();

        expect($charge->refresh()->status)->toBe('open');
    });

});
