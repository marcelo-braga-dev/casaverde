<?php

use App\Jobs\GenerateChargeFromApprovedBillJob;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Services\Automation\ChargeAutomationService;
use Illuminate\Support\Facades\Bus;

describe('ChargeAutomationService::generateMissingCharges', function () {

    beforeEach(function () {
        $this->service = app(ChargeAutomationService::class);
    });

    it('dispatches a job for an approved bill without any charge yet', function () {
        Bus::fake();

        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);

        $this->service->generateMissingCharges();

        Bus::assertDispatched(GenerateChargeFromApprovedBillJob::class, fn ($job) => $job->billId === $bill->id);
    });

    it('does not dispatch a job for a bill that already has an active charge', function () {
        Bus::fake();

        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        CustomerCharge::factory()->create(['concessionaire_bill_id' => $bill->id, 'status' => 'open']);

        $this->service->generateMissingCharges();

        Bus::assertNotDispatched(GenerateChargeFromApprovedBillJob::class);
    });

    it('dispatches a job again for a bill whose only charge was cancelled, allowing an automatic reissue', function () {
        Bus::fake();

        $bill = ConcessionaireBill::factory()->create(['review_status' => 'approved']);
        CustomerCharge::factory()->cancelled()->create(['concessionaire_bill_id' => $bill->id]);

        $this->service->generateMissingCharges();

        Bus::assertDispatched(GenerateChargeFromApprovedBillJob::class, fn ($job) => $job->billId === $bill->id);
    });

    it('does not dispatch a job for a bill that is not approved', function () {
        Bus::fake();

        ConcessionaireBill::factory()->create(['review_status' => 'pending_review']);

        $this->service->generateMissingCharges();

        Bus::assertNotDispatched(GenerateChargeFromApprovedBillJob::class);
    });

});
