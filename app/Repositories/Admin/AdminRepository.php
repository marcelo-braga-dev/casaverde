<?php

namespace App\Repositories\Admin;

use App\DTOs\Endereco\CreateEnderecoUsuarioDTO;
use App\DTOs\Usuario\CreateUsuarioDTO;
use App\Models\Users\Admin;
use App\Models\Users\User;
use App\Models\Users\UserAddress;
use App\Models\Users\UserData;
use App\Services\Users\CreateUserService;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminRepository
{
    public function create(Request $data)
    {
        DB::transaction(function () use ($data) {
            $role = (new RoleUser())->admin();
            $service = new CreateUserService();

            $dto = CreateUsuarioDTO::fromArray($data);
            $userData = $dto->toArray();

            // Conta Acesso
            $user = $service->createUser($userData, $role, $data->senha);

            // Dados do Usuario
            $user->userData()->create(['user_id' => $user->id, ...$userData]);

            // Dados do Usuario
            $user->contatos()->create(['user_id' => $user->id, 'email' => $data['contato']['email'] ?? $user->email, ...$data['contato']]);

            // Endereco
            $service->endereco($user, $data->endereco ?? []);
        });
    }

    public function getAll()
    {
        return (new Admin())->getAll()
            ->orderByDesc('id')
            ->get();
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
