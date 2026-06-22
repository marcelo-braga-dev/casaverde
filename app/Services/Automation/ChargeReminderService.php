<?php

namespace App\Services\Automation;

use App\Jobs\SendChargeReminderJob;
use App\Models\Cobranca\CustomerCharge;

class ChargeReminderService
{
    private const PRE_DUE_DAYS = 3;

    private const OVERDUE_RESEND_INTERVAL_DAYS = 5;

    public function sendDueReminders(): void
    {
        $this->sendUpcomingDueReminders();
        $this->sendOverdueReminders();
    }

    private function sendUpcomingDueReminders(): void
    {
        CustomerCharge::query()
            ->whereIn('status', ['open', 'waiting_payment'])
            ->whereNull('reminder_sent_at')
            ->whereDate('due_date', now()->addDays(self::PRE_DUE_DAYS)->toDateString())
            ->chunkById(100, function ($charges) {
                foreach ($charges as $charge) {
                    SendChargeReminderJob::dispatch($charge->id, 'upcoming_due');
                }
            });
    }

    private function sendOverdueReminders(): void
    {
        CustomerCharge::query()
            ->where('status', 'overdue')
            ->where(function ($query) {
                $query->whereNull('reminder_sent_at')
                    ->orWhereDate('reminder_sent_at', '<=', now()->subDays(self::OVERDUE_RESEND_INTERVAL_DAYS));
            })
            ->chunkById(100, function ($charges) {
                foreach ($charges as $charge) {
                    SendChargeReminderJob::dispatch($charge->id, 'overdue');
                }
            });
    }
}
