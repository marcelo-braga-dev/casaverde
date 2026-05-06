<?php

namespace App\Services\Automation;

use App\Jobs\GeneratePaymentForChargeJob;
use App\Jobs\MarkChargeAsOverdueJob;
use App\Jobs\SyncPaymentStatusJob;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;

class PaymentAutomationService
{
    public function generateMissingPayments(): void
    {
        CustomerCharge::query()
            ->whereIn('status', ['open', 'waiting_payment'])
            ->chunkById(100, function ($charges) {
                foreach ($charges as $charge) {
                    GeneratePaymentForChargeJob::dispatch($charge->id);
                }
            });
    }

    public function markOverdueCharges(): void
    {
        CustomerCharge::query()
            ->whereIn('status', ['open', 'waiting_payment'])
            ->whereDate('due_date', '<', now())
            ->chunkById(100, function ($charges) {
                foreach ($charges as $charge) {
                    MarkChargeAsOverdueJob::dispatch($charge->id);
                }
            });
    }

    public function syncPendingPayments(): void
    {
        PaymentSlip::query()
            ->whereIn('status', ['pending', 'generated'])
            ->chunkById(100, function ($payments) {
                foreach ($payments as $payment) {
                    SyncPaymentStatusJob::dispatch($payment->id);
                }
            });
    }
}
