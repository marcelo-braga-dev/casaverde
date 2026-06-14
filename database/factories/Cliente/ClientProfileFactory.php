<?php

namespace Database\Factories\Cliente;

use App\Models\Cliente\ClientProfile;
use App\Models\Users\UserContact;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientProfileFactory extends Factory
{
    protected $model = ClientProfile::class;

    private static int $cpfCounter = 0;

    private static int $cnpjCounter = 0;

    public function definition(): array
    {
        $contact = UserContact::create([
            'email' => fake()->unique()->safeEmail(),
            'celular' => '41999990000',
        ]);

        return [
            'tipo_pessoa' => 'pf',
            'cpf' => $this->nextCpf(),
            'cnpj' => null,
            'nome' => fake()->name(),
            'razao_social' => null,
            'nome_fantasia' => null,
            'contacts_id' => $contact->id,
            'consultor_user_id' => null,
            'platform_user_id' => null,
            'status' => 'prospect',
            'is_active_client' => false,
            'activated_at' => null,
        ];
    }

    public function pj(): static
    {
        return $this->state(function () {
            $contact = UserContact::create([
                'email' => fake()->unique()->safeEmail(),
                'celular' => '41999990001',
            ]);

            return [
                'tipo_pessoa' => 'pj',
                'cpf' => null,
                'cnpj' => $this->nextCnpj(),
                'nome' => null,
                'razao_social' => fake()->company(),
                'nome_fantasia' => fake()->company(),
                'contacts_id' => $contact->id,
            ];
        });
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'status' => 'contrato_assinado',
            'is_active_client' => true,
            'activated_at' => now(),
        ]);
    }

    public function prospect(): static
    {
        return $this->state(fn () => [
            'status' => 'prospect',
            'is_active_client' => false,
        ]);
    }

    private function nextCpf(): string
    {
        self::$cpfCounter++;

        return str_pad((string) self::$cpfCounter, 11, '0', STR_PAD_LEFT);
    }

    private function nextCnpj(): string
    {
        self::$cnpjCounter++;

        return str_pad((string) (self::$cnpjCounter + 50000), 14, '0', STR_PAD_LEFT);
    }
}
