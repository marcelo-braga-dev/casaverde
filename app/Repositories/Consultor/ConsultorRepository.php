<?php

namespace App\Repositories\Consultor;

use App\DTO\Usuario\CreateUsuarioDTO;
use App\Models\Users\User;
use App\Models\Users\Vendedor;
use App\Services\Users\CreateUserService;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConsultorRepository
{
    public function create(Request $data)
    {
        DB::transaction(function () use ($data) {
            $role = RoleUser::$CONSULTOR;
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
            $service->endereco($user, []);
        });
    }

    public function getAll()
    {
        return (new Vendedor())->getAll()
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
