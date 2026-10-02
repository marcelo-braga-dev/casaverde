<?php

namespace App\Console\Commands;

use App\Models\Importacao\ClientEmailImportSetting;
use App\Services\Energia\Import\ImportEnergyBillService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

class ImportEnergyBillsCommand extends Command
{
    protected $signature = 'energy-bills:import {--user_id=}';

    protected $description = 'Importa contas de energia a partir de caixas IMAP dos clientes.';

    public function handle(ImportEnergyBillService $service): int
    {
        $query = ClientEmailImportSetting::query()
            ->where('is_active', true)
            ->with('user');

        if ($this->option('user_id')) {
            $query->where('user_id', (int) $this->option('user_id'));
        }

        $settings = $query->get();

        if ($settings->isEmpty()) {
            $this->warn('Nenhuma configuração ativa de importação foi encontrada.');

            return self::SUCCESS;
        }

        $hadFailure = false;

        foreach ($settings as $setting) {
            $this->info("Processando cliente #{$setting->user_id} - {$setting->imap_email}");

            try {
                $result = $service->importForSetting($setting);
            } catch (Throwable $e) {
                $hadFailure = true;
                Log::error("[energy-bills:import] Falha no setting #{$setting->id}: ".$e->getMessage());
                $this->error($e->getMessage());

                continue;
            }

            $this->line(sprintf(
                'Processados: %d | Importados: %d | Ignorados: %d | Falharam: %d',
                $result['processed'],
                $result['imported'],
                $result['skipped'],
                $result['failed'],
            ));
        }

        return $hadFailure ? self::FAILURE : self::SUCCESS;
    }
}
