<?php

namespace App\Services\Users;

use App\DTO\Endereco\CreateEnderecoUsuarioDTO;
use App\Models\Users\User;
use App\Models\Users\UserAddress;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class CreateUserService
{
    public function createUser(array $produtor, int $role, ?string $senha, ?int $vendedor = null): User
    {
        $name = $produtor['nome'] ?? $produtor['razao_social'] ?? null;

        if (!$name) {
            throw new RuntimeException('Nome ou razão social é obrigatório para criar o usuário.');
        }

        try {
            return User::query()->create([
                'name' => $name,
                'email' => $produtor['email'] ?? null,
                'role_id' => $role,
                'consultor_id' => $vendedor,
                'status' => 1,
                'password' => Hash::make($senha ?: uniqid('usr_', true)),
            ]);
        } catch (QueryException $exception) {
            $message = mb_strtolower($exception->getMessage());

            if (str_contains($message, 'email') && (str_contains($message, 'duplicate') || str_contains($message, 'unique'))) {
                throw new RuntimeException('E-mail de acesso já está cadastrado em outro usuário!');
            }

            throw $exception;
        }
    }

    public function endereco(User $user, array $endereco = []): void
    {
        $enderecoDTO = CreateEnderecoUsuarioDTO::fromArray($user->id, $endereco);
        UserAddress::create($enderecoDTO->toArray());
    }
}