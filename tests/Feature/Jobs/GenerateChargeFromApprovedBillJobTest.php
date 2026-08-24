<?php

use App\Jobs\GenerateChargeFromApprovedBillJob;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Services\Cobranca\GenerateCustomerChargeFromBillService;

describe('GenerateChargeFromApprovedBillJob', function () {

    it('generates a charge for an approved bill without one', function () {
        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);

        (new GenerateChargeFromApprovedBillJob($bill->id))->handle(app(GenerateCustomerChargeFromBillService::class));

        expect(CustomerCharge::where('concessionaire_bill_id', $bill->id)->count())->toBe(1);
    });

    it('does nothing for a bill that is not approved', function () {
        $bill = ConcessionaireBill::factory()->create(['review_status' => 'pending_review']);

        (new GenerateChargeFromApprovedBillJob($bill->id))->handle(app(GenerateCustomerChargeFromBillService::class));

        expect(CustomerCharge::where('concessionaire_bill_id', $bill->id)->count())->toBe(0);
    });

    it('does not duplicate the charge when the bill already has one', function () {
        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        CustomerCharge::factory()->create(['concessionaire_bill_id' => $bill->id]);

        (new GenerateChargeFromApprovedBillJob($bill->id))->handle(app(GenerateCustomerChargeFromBillService::class));

        expect(CustomerCharge::where('concessionaire_bill_id', $bill->id)->count())->toBe(1);
    });

    it('generates an independent new charge for a new bill even when a previous bill for the same client was cancelled', function () {
        $oldBill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        CustomerCharge::factory()->cancelled()->create([
            'client_profile_id' => $oldBill->client_profile_id,
            'concessionaire_bill_id' => $oldBill->id,
        ]);

        $newBill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $oldBill->client_profile_id,
            'review_status' => 'approved',
        ]);

        (new GenerateChargeFromApprovedBillJob($newBill->id))->handle(app(GenerateCustomerChargeFromBillService::class));

        $newCharge = CustomerCharge::where('concessionaire_bill_id', $newBill->id)->first();

        expect($newCharge)->not->toBeNull()
            ->and($newCharge->status)->toBe('draft')
            ->and(CustomerCharge::where('client_profile_id', $oldBill->client_profile_id)->count())->toBe(2);
    });

    it('generates a replacement charge for the same bill once the previous charge was cancelled', function () {
        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        $oldCharge = CustomerCharge::factory()->cancelled()->create(['concessionaire_bill_id' => $bill->id]);

        (new GenerateChargeFromApprovedBillJob($bill->id))->handle(app(GenerateCustomerChargeFromBillService::class));

        expect(CustomerCharge::where('concessionaire_bill_id', $bill->id)->count())->toBe(2);

        $newCharge = CustomerCharge::where('concessionaire_bill_id', $bill->id)
            ->where('id', '!=', $oldCharge->id)
            ->first();

        expect($newCharge)->not->toBeNull()
            ->and($newCharge->status)->toBe('draft');
    });

    it('does nothing when the bill no longer exists', function () {
        (new GenerateChargeFromApprovedBillJob(999999))->handle(app(GenerateCustomerChargeFromBillService::class));
    })->throwsNoExceptions();

});
