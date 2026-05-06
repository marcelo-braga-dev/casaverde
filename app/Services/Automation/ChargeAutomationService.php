<?php

namespace App\Services\Automation;

use App\Jobs\GenerateChargeFromApprovedBillJob;
use App\Models\Fatura\ConcessionaireBill;

class ChargeAutomationService
{
    public function generateMissingCharges(): void
    {
        ConcessionaireBill::query()
            ->where('review_status', 'approved')
            ->doesntHave('customerCharge')
            ->chunkById(100, function ($bills) {
                foreach ($bills as $bill) {
                    GenerateChargeFromApprovedBillJob::dispatch($bill->id);
                }
            });
    }
}
