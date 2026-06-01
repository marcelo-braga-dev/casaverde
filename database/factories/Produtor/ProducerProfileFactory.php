<?php

namespace Database\Factories\Produtor;

use App\Models\Produtor\ProducerProfile;
use App\Models\Users\UserContact;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProducerProfileFactory extends Factory
{
    protected $model = ProducerProfile::class;

    private static int $counter = 20000;

    public function definition(): array
    {
        $contact = UserContact::create([
            'email'   => fake()->unique()->safeEmail(),
            'celular' => '41988880000',
        ]);

        return [
            'tipo_pessoa'        => 'pf',
            'cpf'                => $this->nextCpf(),
            'cnpj'               => null,
            'nome'               => fake()->name(),
            'razao_social'       => null,
            'nome_fantasia'      => null,
            'contacts_id'        => $contact->id,
            'consultor_user_id'  => null,
            'platform_user_id'   => null,
            'status'             => 'prospect',
            'is_active_producer' => false,
            'activated_at'       => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'status'             => 'ativo',
            'is_active_producer' => true,
            'activated_at'       => now(),
        ]);
    }

    private function nextCpf(): string
    {
        self::$counter++;
        return str_pad((string) self::$counter, 11, '0', STR_PAD_LEFT);
    }
}
