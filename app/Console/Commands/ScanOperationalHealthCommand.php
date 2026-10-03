<?php

namespace App\Console\Commands;

use App\Services\Alert\OperationalHealthScanService;
use Illuminate\Console\Command;

class ScanOperationalHealthCommand extends Command
{
    protected $signature = 'casaverde:scan-operational-health';

    protected $description = 'Verifica rotinas paradas e etapas do faturamento pendentes e atualiza os alertas operacionais';

    public function handle(OperationalHealthScanService $service): void
    {
        foreach ($service->scan() as $check => $count) {
            $this->line(sprintf('%-32s %d', $check, $count));
        }
    }
}
