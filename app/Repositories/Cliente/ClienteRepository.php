<?php

namespace App\Repositories\Cliente;

use App\DTOs\Usuario\CreateUsuarioDTO;
use App\Models\Users\User;
use App\Services\Users\CreateUserService;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteRepository
{
    public function create(Request $data)
    {
        try {
            $dto = CreateUsuarioDTO::fromArray($data);
            $userData = $dto->toArray();
        } catch (\TypeError) {
            throw new \DomainException('Dados Inválidos!');
        }

        DB::transaction(function () use ($data, $userData) {
            $role = RoleUser::$CLIENTE;
            $service = new CreateUserService();

            // Conta Acesso
            $user = $service->createUser($userData, $role, $data->senha, auth()->id());

            // Dados do Usuario
            $user->userData()->create($userData);

            // Dados do Usuario
            $user->contatos()->create(['email' => $data['contato']['email'] ?? $user->email, ...$data['contato']]);

            // Endereco
            $service->endereco($user, $data->endereco ?? []);
        });
    }

    public function getAll()
    {
        return User::where('role_id', RoleUser::$CLIENTE)
            ->with('userData')
            ->orderByDesc('id')
            ->get();
    }

    public function getPaginate()
    {
        return User::where('role_id', RoleUser::$CLIENTE)
            ->somenteMeusClientes()
            ->with('userData')
            ->orderByDesc('id')
            ->paginate();
    }

    public function findAllData($id)
    {
        return (new User)
            ->with('userData')
            ->with('endereco')
            ->with('usina')
            ->find($id);
    }
}
