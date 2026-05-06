<?php

namespace App\Console\Commands;

use App\Services\Automation\ChargeAutomationService;
use Illuminate\Console\Command;

class GenerateMonthlyChargesCommand extends Command
{
    protected $signature = 'casaverde:generate-monthly-charges';

    protected $description = 'Gera cobranças automáticas para faturas aprovadas';

    public function handle(ChargeAutomationService $service): void
    {
        $service->generateMissingCharges();

        $this->info('Cobranças enviadas para fila.');
    }
}
