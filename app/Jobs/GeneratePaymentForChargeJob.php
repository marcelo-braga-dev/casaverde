<?php

namespace App\Jobs;

use App\Models\Cobranca\CustomerCharge;
use App\Services\Pagamento\GeneratePaymentSlipService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GeneratePaymentForChargeJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $chargeId,
    ) {
    }

    public function handle(GeneratePaymentSlipService $service): void
    {
        $charge = CustomerCharge::query()->find($this->chargeId);

        if (!$charge) {
            return;
        }

        if (!in_array($charge->status, ['open', 'waiting_payment'], true)) {
            return;
        }

        $alreadyExists = $charge->paymentSlips()
            ->whereIn('status', ['pending', 'generated'])
            ->exists();

        if ($alreadyExists) {
            return;
        }

        $service->handle($charge);
    }
}
