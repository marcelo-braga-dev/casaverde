<?php

namespace Database\Factories\Cliente;

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientDiscountRuleFactory extends Factory
{
    protected $model = ClientDiscountRule::class;

    public function definition(): array
    {
        return [
            'client_profile_id' => ClientProfile::factory(),
            'discount_percent'  => 15.00,
            'starts_on'         => now()->subDay(),
            'ends_on'           => null,
            'is_active'         => true,
            'notes'             => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'starts_on' => now()->subMonth(),
            'ends_on'   => now()->subDay(),
            'is_active' => false,
        ]);
    }

    public function future(): static
    {
        return $this->state(fn () => [
            'starts_on' => now()->addDay(),
            'ends_on'   => null,
            'is_active' => false,
        ]);
    }
}
