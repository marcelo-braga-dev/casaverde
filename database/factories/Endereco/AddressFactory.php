<?php

namespace Database\Factories\Endereco;

use App\Models\Endereco\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory
{
    protected $model = Address::class;

    public function definition(): array
    {
        return [
            'cep'         => '80010000',
            'rua'         => fake()->streetName(),
            'numero'      => (string) fake()->buildingNumber(),
            'complemento' => null,
            'bairro'      => fake()->word(),
            'cidade'      => 'Curitiba',
            'estado'      => 'PR',
            'referencia'  => null,
            'latitude'    => null,
            'longitude'   => null,
        ];
    }
}
