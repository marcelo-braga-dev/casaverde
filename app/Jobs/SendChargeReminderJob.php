<?php

namespace App\Jobs;

use App\Models\Cobranca\CustomerCharge;
use App\Services\Automation\GenerateChargeReminderAlertService;
use App\Services\Cliente\ClientChargeNotificationService;
use App\Services\Pagamento\PaymentSlipExpiredAlertService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendChargeReminderJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $chargeId,
        public readonly string $reason,
    ) {}

    public function handle(
        GenerateChargeReminderAlertService $service,
        PaymentSlipExpiredAlertService $expiredAlertService,
        ClientChargeNotificationService $clientNotifications,
    ): void {
        $charge = CustomerCharge::query()->find($this->chargeId);

        if (! $charge) {
            return;
        }

        if ($this->reason === 'payment_slip_expired') {
            if ($charge->isAguardandoNovoBoleto()) {
                $expiredAlertService->notify($charge);
            }

            return;
        }

        $service->handle($charge, $this->reason);

        if ($this->reason === 'upcoming_due') {
            $clientNotifications->dueReminder($charge);
        }
    }
}
