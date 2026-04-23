<?php

namespace App\Console\Commands;

use App\Models\Importacao\ClientEmailImportSetting;
use App\Services\Energia\Import\ImportEnergyBillService;
use Illuminate\Console\Command;

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

        foreach ($settings as $setting) {
            $this->info("Processando cliente #{$setting->user_id} - {$setting->imap_email}");

            $result = $service->importForSetting($setting);

            $this->line(sprintf(
                'Processados: %d | Importados: %d | Ignorados: %d | Falharam: %d',
                $result['processed'],
                $result['imported'],
                $result['skipped'],
                $result['failed'],
            ));
        }

        return self::SUCCESS;
    }
}