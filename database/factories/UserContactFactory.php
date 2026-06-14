<?php

namespace Database\Factories;

use App\Models\Users\UserContact;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserContactFactory extends Factory
{
    protected $model = UserContact::class;

    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'celular' => '41999990000',
            'celular_2' => null,
            'telefone' => null,
        ];
    }
}
