<?php

namespace App\Console\Commands;

use App\Services\Automation\PaymentAutomationService;
use Illuminate\Console\Command;

class MarkOverdueChargesCommand extends Command
{
    protected $signature = 'casaverde:mark-overdue-charges';

    protected $description = 'Marca cobranças vencidas automaticamente';

    public function handle(PaymentAutomationService $service): void
    {
        $service->markOverdueCharges();

        $this->info('Cobranças vencidas enviadas para fila.');
    }
}
