<?php

namespace App\Console\Commands;

use App\Models\Cliente\ClientProfile;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Services\Fatura\ImportAutomaticConcessionaireBillService;
use Illuminate\Console\Command;

class ImportConcessionaireBillsCommand extends Command
{
    protected $signature = 'concessionaire-bills:import {--client_profile_id=}';
    protected $description = 'Importa automaticamente faturas da concessionária a partir das caixas IMAP dos clientes.';

    public function handle(ImportAutomaticConcessionaireBillService $service): int
    {
        $settings = ClientEmailImportSetting::query()
            ->where('is_active', true)
            ->get();

        if ($this->option('client_profile_id')) {
            $settings = $settings->filter(function ($setting) {
                return (int) $setting->user_id === (int) $this->option('client_profile_id');
            })->values();
        }

        if ($settings->isEmpty()) {
            $this->warn('Nenhuma configuração ativa de importação foi encontrada.');
            return self::SUCCESS;
        }

        foreach ($settings as $setting) {
            $clientProfile = ClientProfile::query()
                ->where('platform_user_id', $setting->user_id)
                ->first();

            if (!$clientProfile) {
                $this->warn("Nenhum client_profile encontrado para o user_id {$setting->user_id}.");
                continue;
            }

            $this->info("Processando cliente #{$clientProfile->id} - {$setting->imap_email}");

            $result = $service->handle($clientProfile, $setting);

            $this->line(sprintf(
                'Processados: %d | Importados: %d | Ignorados: %d | Falharam: %d',
                $result['processed'],
                $result['imported'],
                $result['skipped'],
                $result['failed']
            ));
        }

        return self::SUCCESS;
    }
}