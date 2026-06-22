<?php

namespace App\Console\Commands;

use App\Services\Automation\PaymentAutomationService;
use Illuminate\Console\Command;

class GenerateMissingPaymentsCommand extends Command
{
    protected $signature = 'casaverde:generate-missing-payments';

    protected $description = 'Gera boletos/cobranças de pagamento para cobranças abertas que ainda não possuem pagamento ativo';

    public function handle(PaymentAutomationService $service): void
    {
        $service->generateMissingPayments();

        $this->info('Geração de pagamentos pendentes enviada para fila.');
    }
}
