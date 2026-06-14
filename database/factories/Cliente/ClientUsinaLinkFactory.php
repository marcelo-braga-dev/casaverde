<?php

namespace Database\Factories\Cliente;

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientUsinaLinkFactory extends Factory
{
    protected $model = ClientUsinaLink::class;

    public function definition(): array
    {
        return [
            'client_profile_id' => ClientProfile::factory(),
            'usina_id' => UsinaSolar::factory(),
            'started_at' => now()->subMonth(),
            'ended_at' => null,
            'is_active' => true,
            'notes' => null,
            'allocated_energy_kwh' => 500.000,
            'discount_percentage' => 15.00,
            'status' => ClientUsinaLinkStatus::Active->value,
            'created_by_user_id' => null,
            'updated_by_user_id' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
            'status' => ClientUsinaLinkStatus::Finished->value,
            'ended_at' => now(),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
            'status' => ClientUsinaLinkStatus::Cancelled->value,
            'ended_at' => now(),
        ]);
    }
}
