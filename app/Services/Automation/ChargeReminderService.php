<?php

namespace App\Services\Automation;

use App\Enums\Alert\OperationalAlertStatus;
use App\Enums\Cobranca\CustomerChargeStatus;
use App\Jobs\SendChargeReminderJob;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Pagamento\PaymentSlipExpiredAlertService;

class ChargeReminderService
{
    private const PRE_DUE_DAYS = 3;

    private const OVERDUE_RESEND_INTERVAL_DAYS = 5;

    public function __construct(
        private readonly GenerateChargeReminderAlertService $reminderAlertService,
    ) {}

    public function sendDueReminders(): void
    {
        $this->resolveStaleReminders();
        $this->sendUpcomingDueReminders();
        $this->sendOverdueReminders();
        $this->sendExpiredSlipReminders();
    }

    // Lembrete de cobrança que já foi paga ou cancelada (inclusive antes de esse fechamento
    // existir no cancelamento/pagamento) não tem mais o que cobrar.
    private function resolveStaleReminders(): void
    {
        CustomerCharge::query()
            ->whereIn('status', CustomerChargeStatus::finalValues())
            ->whereHas('operationalAlerts', fn ($q) => $q
                ->whereIn('type', ['charge_overdue_reminder', 'charge_upcoming_due_reminder'])
                ->whereIn('status', [OperationalAlertStatus::Open->value, OperationalAlertStatus::InProgress->value]))
            ->each(fn (CustomerCharge $charge) => $this->reminderAlertService->resolveFor(
                $charge,
                $charge->isPaid() ? 'Cobrança paga.' : 'Cobrança cancelada.',
            ));
    }

    private function sendUpcomingDueReminders(): void
    {
        CustomerCharge::query()
            ->where('status', 'open')
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
