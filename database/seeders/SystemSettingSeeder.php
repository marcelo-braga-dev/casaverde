<?php

namespace Database\Seeders;

use App\Services\Config\SystemSettingService;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(SystemSettingService::class);

        $service->set(
            'default_discount_percentage',
            20,
            'float'
        );
    }
}
