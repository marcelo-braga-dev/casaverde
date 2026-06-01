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
    }
}
