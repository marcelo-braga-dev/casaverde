<?php

use App\Models\Cobranca\CustomerCharge;

describe('CustomerCharge model', function () {

    it('isDraft returns true only for draft status', function () {
        expect((new CustomerCharge(['status' => 'draft']))->isDraft())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'open']))->isDraft())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'paid']))->isDraft())->toBeFalse();
    });

    it('isOpen returns true for open, waiting_payment and overdue', function () {
        expect((new CustomerCharge(['status' => 'open']))->isOpen())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'waiting_payment']))->isOpen())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'overdue']))->isOpen())->toBeTrue();
    });

    it('isOpen returns false for draft and paid', function () {
        expect((new CustomerCharge(['status' => 'draft']))->isOpen())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'paid']))->isOpen())->toBeFalse();
    });

    it('isPaid returns true only for paid status', function () {
        expect((new CustomerCharge(['status' => 'paid']))->isPaid())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'open']))->isPaid())->toBeFalse();
    });

    it('canBeCancelled returns false for paid and cancelled', function () {
        expect((new CustomerCharge(['status' => 'paid']))->canBeCancelled())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'cancelled']))->canBeCancelled())->toBeFalse();
    });

    it('canBeCancelled returns true for draft and open', function () {
        expect((new CustomerCharge(['status' => 'draft']))->canBeCancelled())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'open']))->canBeCancelled())->toBeTrue();
    });

    it('canBeMarkedAsPaid returns false for paid and cancelled', function () {
        expect((new CustomerCharge(['status' => 'paid']))->canBeMarkedAsPaid())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'cancelled']))->canBeMarkedAsPaid())->toBeFalse();
    });

    it('canBeMarkedAsPaid returns true for draft and open', function () {
        expect((new CustomerCharge(['status' => 'draft']))->canBeMarkedAsPaid())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'open']))->canBeMarkedAsPaid())->toBeTrue();
    });

    it('canBeMarkedAsOverdue returns true only for open and waiting_payment', function () {
        expect((new CustomerCharge(['status' => 'open']))->canBeMarkedAsOverdue())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'waiting_payment']))->canBeMarkedAsOverdue())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'draft']))->canBeMarkedAsOverdue())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'paid']))->canBeMarkedAsOverdue())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'overdue']))->canBeMarkedAsOverdue())->toBeFalse();
    });
});
