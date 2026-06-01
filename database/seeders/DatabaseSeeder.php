<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolesSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(ConcessionariasSeeder::class);
        $this->call(SystemSettingSeeder::class);
        $this->call(DemoDataSeeder::class);
    }
}
