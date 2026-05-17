<?php

namespace App\Console\Commands;

use App\Services\Usina\ScanUsinaOperationalAlertsService;
use Illuminate\Console\Command;

class ScanUsinaOperationalAlertsCommand extends Command
{
    protected $signature = 'usinas:scan-alerts
        {--year= : Ano de referência}
        {--month= : Mês de referência}
        {--usina_id= : ID específico da usina}';

    protected $description = 'Analisa as usinas e gera alertas operacionais automáticos.';

    public function handle(ScanUsinaOperationalAlertsService $service): int
    {
        $result = $service->handle(
            year: $this->option('year') ? (int) $this->option('year') : null,
            month: $this->option('month') ? (int) $this->option('month') : null,
            usinaId: $this->option('usina_id') ? (int) $this->option('usina_id') : null,
        );

        $this->info('Scanner de alertas finalizado.');

        $this->table(
            ['Campo', 'Valor'],
            [
                ['Ano', $result['reference_year']],
                ['Mês', $result['reference_month']],
                ['Usinas analisadas', $result['usinas_scanned']],
                ['Alertas criados/atualizados', $result['alerts_created_or_updated']],
            ]
        );

        return self::SUCCESS;
    }
}
