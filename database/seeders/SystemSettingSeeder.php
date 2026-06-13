<?php

namespace Database\Seeders;

use App\Services\Config\SystemSettingService;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(SystemSettingService::class);

        // Taxa de desconto padrão para novos clientes
        $service->set('default_discount_percentage', 20, 'float');

        // Taxa de administração padrão para novos produtores
        $service->set('default_producer_fee_percentage', 15, 'float');

        // Redução de consumo exibida ao produtor na proposta de investimento
        $service->set('producer_proposal_consumer_discount_percentage', 20, 'float');

        // Configurações IMAP padrão para importação de faturas
        $service->set('imap_default_host', 'mail.casaverde.com.br', 'string');
        $service->set('imap_default_port', 993, 'integer');
        $service->set('imap_default_encryption', 'ssl', 'string');
    }
}
