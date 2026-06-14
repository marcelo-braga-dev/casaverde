<?php

namespace Database\Factories\Proposta;

use App\Models\Cliente\ClientProfile;
use App\Models\Proposta\CommercialProposal;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommercialProposalFactory extends Factory
{
    protected $model = CommercialProposal::class;

    public function definition(): array
    {
        return [
            'client_profile_id' => ClientProfile::factory(),
            'consultor_user_id' => null,
            'concessionaria_id' => null,
            'address_id' => null,
            'status' => 'emitida',
            'issued_at' => now()->toDateString(),
            'valid_until' => now()->addDays(30)->toDateString(),
            'media_consumo' => 350.00,
            'discount_percent' => 15.00,
            'prazo_locacao' => 12,
            'valor_medio' => 350.00,
            'unidade_consumidora' => fake()->numerify('##########'),
            'notes' => null,
        ];
    }

    public function emitida(): static
    {
        return $this->state(fn () => ['status' => 'emitida']);
    }

    public function aprovada(): static
    {
        return $this->state(fn () => ['status' => 'aprovada']);
    }
}
