<?php

namespace Database\Factories\Usina;

use App\Enums\Usina\UsinaOperationalStatus;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Factories\Factory;

class UsinaSolarFactory extends Factory
{
    protected $model = UsinaSolar::class;

    public function definition(): array
    {
        return [
            'usina_nome' => 'Usina '.fake()->word(),
            'producer_profile_id' => null,
            'consultor_user_id' => null,
            'concessionaria_id' => Concessionaria::factory(),
            'usina_block_id' => null,
            'address_id' => null,
            'status' => 'ativo',
            'uc' => fake()->numerify('##########'),
            'media_geracao' => 1500.00,
            'prazo_locacao' => 20,
            'potencia_usina' => 15.00,
            'taxa_comissao' => 5.00,
            'inversores' => 'Growatt 15kW',
            'modulos' => '36 x 415W',
            'operational_status' => UsinaOperationalStatus::Active,
            'operation_started_at' => now()->subYear()->toDateString(),
            'energia_disponivel_kwh' => 1500.000,
            'energia_alocada_kwh' => 0.000,
            'energia_saldo_kwh' => 1500.000,
            'admin_notes' => null,
        ];
    }

    public function comEnergia(float $disponivel = 1500.0): static
    {
        return $this->state(fn () => [
            'energia_disponivel_kwh' => $disponivel,
            'energia_alocada_kwh' => 0.000,
            'energia_saldo_kwh' => $disponivel,
        ]);
    }

    public function semSaldo(): static
    {
        return $this->state(fn () => [
            'energia_disponivel_kwh' => 500.000,
            'energia_alocada_kwh' => 500.000,
            'energia_saldo_kwh' => 0.000,
        ]);
    }
}
