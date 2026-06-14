<?php

namespace App\Jobs;

use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\SyncPaymentSlipService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncPaymentStatusJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $paymentId,
    ) {}

    public function handle(SyncPaymentSlipService $service): void
    {
        $payment = PaymentSlip::query()
            ->with('providerAccount')
            ->find($this->paymentId);

        if (! $payment) {
            return;
        }

        if (! $payment->providerAccount) {
            return;
        }

        if (! in_array($payment->status, ['pending', 'generated'], true)) {
            return;
        }

        $service->handle($payment);
    }
}
