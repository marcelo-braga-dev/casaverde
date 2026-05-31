<?php

namespace App\Repositories\Produtor;

use App\DTOs\Endereco\CreateEnderecoDTO;
use App\DTOs\UsinaSolar\CreateUsinaDTO;
use App\DTOs\Usuario\CreateUsuarioDTO;
use App\Models\Users\Produtor;
use App\Models\Users\User;
use App\Models\Usina\UsinaAddress;
use App\Models\Usina\UsinaSolar;
use App\Services\Users\CreateUserService;
use App\src\Roles\RoleUser;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdutorRepository
{
    public function create(Request $data)
    {
        try {
            return DB::transaction(function () use ($data) {
                $role = (new RoleUser())->produtor();
                $service = new CreateUserService();

                $dto = CreateUsuarioDTO::fromArray($data);
                $userData = $dto->toArray();

                // Conta Acesso
                $user = $service->createUser($userData, $role, $data->senha, auth()->id());

                // Dados do Usuario
                $user->userData()->create(['user_id' => $user->id, ...$userData]);

                // Dados do Usuario
                $user->contatos()->create(['user_id' => $user->id, 'email' => $data['contato']['email'] ?? $user->email, ...$data['contato']]);

                // Endereco
                $service->endereco($user, $data->endereco ?? []);

                // Usina Solar
                $usinaDTO = CreateUsinaDTO::fromArray($user->id, $data->usina);
                $usina = $usinaDTO->toArray();
                $usinaData = UsinaSolar::create($usina);
                $usinaEnderecoDTO = CreateEnderecoDTO::fromArray($data->usina_endereco ?? []);
                $usinaEndereco = $usinaEnderecoDTO->toArray();

                UsinaAddress::create(['usina_id' => $usinaData->id, ...$usinaEndereco]);

                return $user->id;
            });
        } catch (QueryException|\DomainException $exception) {
            throw new \DomainException($exception->getMessage());
        }
    }

    public function getAll()
    {
        return (new Produtor())->produtores();
    }

    public function getGroupByStatus()
    {
        return (new Produtor())
            ->produtores()
            ->groupBy('status');
    }

    public function findAllData($id)
    {
        return (new User)
            ->with(['userData', 'usina', 'contatos'])
            ->find($id);
    }

    public function find($id)
    {
        return (new User)
            ->with(['userData', 'endereco', 'usina', 'contatos'])
            ->find($id);
    }
}
