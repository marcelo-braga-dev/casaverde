<?php

namespace App\Console\Commands;

use App\Services\Automation\PaymentAutomationService;
use Illuminate\Console\Command;

class SyncPendingPaymentsCommand extends Command
{
    protected $signature = 'casaverde:sync-payments';

    protected $description = 'Sincroniza pagamentos pendentes com providers';

    public function handle(PaymentAutomationService $service): void
    {
        $service->syncPendingPayments();

        $this->info('Pagamentos enviados para sincronização.');
    }
}
