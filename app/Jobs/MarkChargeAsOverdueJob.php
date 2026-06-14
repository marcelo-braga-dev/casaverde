<?php

namespace App\Jobs;

use App\Models\Cobranca\CustomerCharge;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class MarkChargeAsOverdueJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $chargeId,
    ) {}

    public function handle(): void
    {
        $charge = CustomerCharge::query()->find($this->chargeId);

        if (! $charge) {
            return;
        }

        if (! in_array($charge->status, ['open', 'waiting_payment'], true)) {
            return;
        }

        if (! $charge->due_date) {
            return;
        }

        if ($charge->due_date->isFuture()) {
            return;
        }

        $charge->update([
            'status' => 'overdue',
        ]);
    }
}
