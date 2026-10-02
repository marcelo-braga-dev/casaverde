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

    // Sequenciais, mas com dígitos verificadores válidos (DocumentValidator).
    private function nextCpf(): string
    {
        self::$cpfCounter++;

        $cpf = str_pad((string) (self::$cpfCounter + 100000000), 9, '0', STR_PAD_LEFT);

        foreach ([10, 11] as $weight) {
            $sum = 0;
            foreach (str_split($cpf) as $i => $digit) {
                $sum += (int) $digit * ($weight - $i);
            }
            $cpf .= ((10 * $sum) % 11) % 10;
        }

        return $cpf;
    }

    private function nextCnpj(): string
    {
        self::$cnpjCounter++;

        $cnpj = str_pad((string) (self::$cnpjCounter + 50000), 8, '0', STR_PAD_LEFT).'0001';

        foreach ([[5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]] as $weights) {
            $sum = 0;
            foreach ($weights as $i => $weight) {
                $sum += (int) $cnpj[$i] * $weight;
            }
            $cnpj .= $sum % 11 < 2 ? 0 : 11 - ($sum % 11);
        }

        return $cnpj;
    }
}
