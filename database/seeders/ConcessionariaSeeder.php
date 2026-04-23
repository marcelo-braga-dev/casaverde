<?php

namespace Database\Seeders;

use App\Models\Usina\Concessionaria;
use Illuminate\Database\Seeder;

class ConcessionariaSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nome' => 'Copel', 'tarifa_gd2' => 0, 'estado' => 'PR', 'status' => 'ativo'],
            ['nome' => 'CPFL', 'tarifa_gd2' => 0, 'estado' => 'SP', 'status' => 'ativo'],
            ['nome' => 'Cemig', 'tarifa_gd2' => 0, 'estado' => 'MG', 'status' => 'ativo'],
            ['nome' => 'Enel', 'tarifa_gd2' => 0, 'estado' => 'SP', 'status' => 'ativo'],
            ['nome' => 'Neoenergia', 'tarifa_gd2' => 0, 'estado' => 'BA', 'status' => 'ativo'],
        ];

        foreach ($items as $item) {
            Concessionaria::updateOrCreate(
                ['nome' => $item['nome']],
                $item
            );
        }
    }
}