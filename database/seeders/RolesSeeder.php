<?php

namespace Database\Seeders;

use App\Models\Users\Roles;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Roles::create(['id' => 1, 'nome' => 'Admin']);
        Roles::create(['id' => 2, 'nome' => 'Consultor']);
        Roles::create(['id' => 3, 'nome' => 'Produtor Solar']);
        Roles::create(['id' => 4, 'nome' => 'Cliente Consumidor']);
    }
}
