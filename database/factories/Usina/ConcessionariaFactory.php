<?php

namespace Database\Factories\Usina;

use App\Models\Usina\Concessionaria;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConcessionariaFactory extends Factory
{
    protected $model = Concessionaria::class;

    public function definition(): array
    {
        return [
            'nome'       => 'Concessionária ' . fake()->company(),
            'estado'     => fake()->randomElement(['SP', 'RJ', 'MG', 'PR', 'RS', 'SC']),
            'tarifa_gd2' => fake()->randomFloat(6, 0.5, 1.2),
            'status'     => 'ativo',
        ];
    }
}
