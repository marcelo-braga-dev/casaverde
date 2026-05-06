<?php

namespace App\Jobs;

use App\Models\Fatura\ConcessionaireBill;
use App\Services\Cobranca\GenerateCustomerChargeFromBillService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateChargeFromApprovedBillJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $billId,
    ) {
    }

    public function handle(GenerateCustomerChargeFromBillService $service): void
    {
        $bill = ConcessionaireBill::query()->find($this->billId);

        if (!$bill) {
            return;
        }

        if ($bill->review_status !== 'approved') {
            return;
        }

        $alreadyExists = $bill->customerCharge()->exists();

        if ($alreadyExists) {
            return;
        }

        $service->handle($bill);
    }
}
