<?php

namespace App\Console\Commands;

use App\Models\Cliente\ClientProfile;
use App\Services\Fatura\ImportAutomaticConcessionaireBillService;
use Illuminate\Console\Command;

class ImportConcessionaireBillsCommand extends Command
{
    protected $signature   = 'concessionaire-bills:import {--client_profile_id= : Processa apenas um cliente específico}';
    protected $description = 'Importa automaticamente faturas de energia das caixas IMAP configuradas.';

    public function handle(ImportAutomaticConcessionaireBillService $service): int
    {
        $clientProfileId = $this->option('client_profile_id');
        $onlyClient      = null;

        if ($clientProfileId) {
            $onlyClient = ClientProfile::find((int) $clientProfileId);
            if (!$onlyClient) {
                $this->error("client_profile_id {$clientProfileId} não encontrado.");
                return self::FAILURE;
            }
        }

        $this->info('Iniciando importação...');
        $startTime = microtime(true);

        $run = $service->run(
            onlyClient:          $onlyClient,
            triggeredBy:         'command',
            triggeredByUserId:   null,
        );

        $elapsed = round(microtime(true) - $startTime, 2);

        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Código do Run',         $run->run_code],
                ['Status',                $run->status],
                ['Configurações',         $run->total_settings],
                ['Emails processados',    $run->total_processed],
                ['Faturas importadas',    $run->total_imported],
                ['Ignorados (duplicata)', $run->total_skipped],
                ['Falharam',              $run->total_failed],
                ['Duração',               "{$elapsed}s"],
            ]
        );

        if ($run->error_message) {
            $this->error('Erro fatal: ' . $run->error_message);
        }

        if ($run->total_failed > 0) {
            $this->warn("{$run->total_failed} email(s) falharam. Veja o histórico de importação para detalhes.");
        }

        return $run->status === 'failed' ? self::FAILURE : self::SUCCESS;
    }
}
