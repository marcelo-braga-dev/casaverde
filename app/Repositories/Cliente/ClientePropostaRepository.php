<?php

namespace App\Repositories\Cliente;

use App\Models\Cliente\ClienteProposta;
use App\Models\Users\UserData;
use App\Services\Config\ConfigService;
use App\Services\Users\CreateUserService;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientePropostaRepository
{
    public function create(Request $data)
    {
        DB::transaction(function () use ($data) {

            $clienteId = $data->cliente_id ?? $this->verificarOuCriarUsuarioPorDocumento($data->all());

            $proposta = ClienteProposta::create([
                'user_id' => $clienteId,
                'concessionaria_id' => $data?->concessionaria_id,
                'taxa_reducao' => (new ConfigService)->getTaxaReducao(),
                'media_consumo' => $data?->dados['media_consumo'] ?? null,
                'prazo_locacao' => $data?->dados['prazo_locacao'],
                'valor_medio' => $data?->dados['valor_medio'],
                'unidade_consumidora' => $data?->dados['unidade_consumidora'] ?? null,
            ]);

            $proposta->endereco()->create([
                'cep' => $data?->endereco['cep'] ?? null,
                'rua' => $data?->endereco['rua'] ?? null,
                'numero' => $data?->endereco['numero'] ?? null,
                'complemento' => $data?->endereco['complemento'] ?? null,
                'bairro' => $data?->endereco['bairro'] ?? null,
                'cidade' => $data?->endereco['cidade'] ?? null,
                'estado' => $data?->endereco['estado'] ?? null,
                'referencia' => $data?->endereco['referencia'] ?? null,
            ]);
        });
    }

    public function get()
    {
        return (new ClienteProposta)
            ->orderByDesc('id')
            ->get();
    }

    public function findCliente($id)
    {
        return (new ClienteProposta)
            ->where('user_id', $id)
            ->orderByDesc('id')
            ->get();
    }

    public function verificarOuCriarUsuarioPorDocumento($userData): int
    {
        $cnpj = preg_replace('/\D/', '', $userData['cnpj'] ?? null);
        $cpf = preg_replace('/\D/', '', $userData['cpf'] ?? null);

        if ($cpf) {
            $registroExistente = UserData::where('cpf', $cpf)->first();
        }

        if ($cnpj) {
            $registroExistente = UserData::where('cnpj', $cnpj)->first();
        }

        if ($registroExistente) {
            return $registroExistente->user_id;
        }

        $role = RoleUser::$CLIENTE;
        $service = new CreateUserService;

        // Conta Acesso
        $user = $service->createUser($userData, $role, null, auth()->id());

        // Dados do Usuario
        $user->userData()->create($userData);

        return $user->id;
    }
}
