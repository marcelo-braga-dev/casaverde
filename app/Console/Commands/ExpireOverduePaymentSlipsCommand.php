<?php

namespace App\Console\Commands;

use App\Services\Automation\PaymentAutomationService;
use Illuminate\Console\Command;

class ExpireOverduePaymentSlipsCommand extends Command
{
    protected $signature = 'casaverde:expire-payment-slips';

    protected $description = 'Marca como vencidos os boletos/Pix cuja data passou sem pagamento e alerta o consultor para emitir um novo';

    public function handle(PaymentAutomationService $service): void
    {
        $expired = $service->expireOverdueSlips();

        $this->info("Boletos marcados como vencidos: {$expired}.");
    }
}
