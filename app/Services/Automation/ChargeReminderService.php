<?php

namespace App\Services\Automation;

use App\Jobs\SendChargeReminderJob;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Pagamento\PaymentSlipExpiredAlertService;

class ChargeReminderService
{
    private const PRE_DUE_DAYS = 3;

    private const OVERDUE_RESEND_INTERVAL_DAYS = 5;

    public function sendDueReminders(): void
    {
        $this->sendUpcomingDueReminders();
        $this->sendOverdueReminders();
        $this->sendExpiredSlipReminders();
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
            // Sem boleto pagável, cobrar o cliente não adianta: esses casos recebem o
            // alerta de boleto vencido (gerar e enviar um novo) em vez deste.
            ->whereNotIn('id', CustomerCharge::query()->aguardandoNovoBoleto()->select('id'))
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

    // Mesma cadência dos lembretes de vencida: renova o alerta a cada 5 dias enquanto
    // ninguém emitir o novo boleto, mesmo que o alerta anterior tenha sido ignorado.
    private function sendExpiredSlipReminders(): void
    {
        CustomerCharge::query()
            ->aguardandoNovoBoleto()
            ->whereDoesntHave('operationalAlerts', fn ($query) => $query
                ->where('type', PaymentSlipExpiredAlertService::TYPE)
                ->where('detected_at', '>', now()->subDays(self::OVERDUE_RESEND_INTERVAL_DAYS)))
            ->chunkById(100, function ($charges) {
                foreach ($charges as $charge) {
                    SendChargeReminderJob::dispatch($charge->id, 'payment_slip_expired');
                }
            });
    }
}
