<?php

namespace App\Jobs;

use App\Models\Cobranca\CustomerCharge;
use App\Services\Automation\GenerateChargeReminderAlertService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendChargeReminderJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $chargeId,
        public readonly string $reason,
    ) {}

    public function handle(GenerateChargeReminderAlertService $service): void
    {
        $charge = CustomerCharge::query()->find($this->chargeId);

        if (! $charge) {
            return;
        }

        $service->handle($charge, $this->reason);
    }
}
