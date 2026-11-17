<?php

use App\Models\Cobranca\CustomerCharge;

describe('CustomerCharge model', function () {

    it('isDraft returns true only for draft status', function () {
        expect((new CustomerCharge(['status' => 'draft']))->isDraft())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'open']))->isDraft())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'paid']))->isDraft())->toBeFalse();
    });

    it('canReceivePayment returns true for open and overdue', function () {
        expect((new CustomerCharge(['status' => 'open']))->canReceivePayment())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'overdue']))->canReceivePayment())->toBeTrue();
    });

    it('canReceivePayment returns false for draft and paid', function () {
        expect((new CustomerCharge(['status' => 'draft']))->canReceivePayment())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'paid']))->canReceivePayment())->toBeFalse();
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

    it('canBeMarkedAsOverdue returns true only for open', function () {
        expect((new CustomerCharge(['status' => 'open']))->canBeMarkedAsOverdue())->toBeTrue()
            ->and((new CustomerCharge(['status' => 'draft']))->canBeMarkedAsOverdue())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'paid']))->canBeMarkedAsOverdue())->toBeFalse()
            ->and((new CustomerCharge(['status' => 'overdue']))->canBeMarkedAsOverdue())->toBeFalse();
    });
});
