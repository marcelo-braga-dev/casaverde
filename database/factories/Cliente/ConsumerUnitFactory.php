<?php

namespace Database\Factories\Cliente;

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsumerUnitFactory extends Factory
{
    protected $model = ConsumerUnit::class;

    public function definition(): array
    {
        return [
            'client_profile_id' => ClientProfile::factory(),
            'uc_code' => fake()->unique()->numerify('##########'),
            'label' => null,
            'concessionaria_id' => null,
            'address_id' => null,
            'status' => 'active',
            'notes' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'status' => 'inactive',
        ]);
    }
}
