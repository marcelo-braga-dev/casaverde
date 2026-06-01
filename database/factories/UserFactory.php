<?php

namespace Database\Factories;

use App\src\Roles\RoleUser;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Users\User>
 */
class UserFactory extends Factory
{
    protected $model = \App\Models\Users\User::class;

    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name'               => fake()->name(),
            'email'              => fake()->unique()->safeEmail(),
            'email_verified_at'  => now(),
            'password'           => static::$password ??= Hash::make('password'),
            'remember_token'     => Str::random(10),
            'role_id'            => RoleUser::$ADMIN,
            'status'             => '1',
            'consultor_id'       => null,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => ['role_id' => RoleUser::$ADMIN]);
    }

    public function consultor(): static
    {
        return $this->state(fn () => ['role_id' => RoleUser::$CONSULTOR]);
    }

    public function produtor(): static
    {
        return $this->state(fn () => ['role_id' => RoleUser::$PRODUTOR]);
    }

    public function cliente(): static
    {
        return $this->state(fn () => ['role_id' => RoleUser::$CLIENTE]);
    }

    public function unverified(): static
    {
        return $this->state(fn () => ['email_verified_at' => null]);
    }
}
