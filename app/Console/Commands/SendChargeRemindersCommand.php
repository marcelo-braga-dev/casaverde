<?php

namespace App\Console\Commands;

use App\Services\Automation\ChargeReminderService;
use Illuminate\Console\Command;

class SendChargeRemindersCommand extends Command
{
    protected $signature = 'casaverde:send-charge-reminders';

    protected $description = 'Gera alertas de lembrete de cobrança (pré-vencimento e vencidas) para os consultores';

    public function handle(ChargeReminderService $service): void
    {
        $service->sendDueReminders();

        $this->info('Lembretes de cobrança enviados para fila.');
    }
}
