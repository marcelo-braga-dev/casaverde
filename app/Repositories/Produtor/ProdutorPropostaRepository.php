<?php

namespace App\Repositories\Produtor;

use App\Models\Produtor\ProducerProfile;
use App\Models\Produtor\ProdutorPropostas;
use App\Models\Users\UserData;
use App\Services\Users\CreateUserService;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ProdutorPropostaRepository
{
    public function find(int $id): ?ProdutorPropostas
    {
        return ProdutorPropostas::query()->find($id);
    }

    public function getProdutor(int $id)
    {
        return ProdutorPropostas::query()
            ->where('produtor_id', $id)
            ->orderByDesc('id')
            ->get();
    }

    public function getAll()
    {
        return ProdutorPropostas::query()
            ->orderByDesc('id')
            ->get();
    }

    public function store(array $data): ProdutorPropostas
    {
        return DB::transaction(function () use ($data) {
            $produtorId = $data['produtor_id'] ?? $this->verificarOuCriarUsuarioPorDocumento($data);

            $proposta = ProdutorPropostas::query()->create([
                'produtor_id' => $produtorId,
                'consultor_id' => auth()->id(),
                'potencia' => $data['dados']['potencia'] ?? null,
                'geracao_media' => $data['dados']['geracao_media'] ?? null,
                'valor_investimento' => $data['dados']['valor_investimento'] ?? null,
                'prazo_locacao' => $data['dados']['prazo_locacao'] ?? null,
                'taxa_reducao' => $data['taxa_reducao'] ?? null,
            ]);

            if (! empty($data['endereco']) && is_array($data['endereco'])) {
                $proposta->endereco()->create($data['endereco']);
            }

            return $proposta;
        });
    }

    private function verificarOuCriarUsuarioPorDocumento(array $userData): int
    {
        $registroExistente = null;

        $cnpj = preg_replace('/\D/', '', $userData['cnpj'] ?? '');
        $cpf = preg_replace('/\D/', '', $userData['cpf'] ?? '');

        if ($cpf) {
            $registroExistente = UserData::query()
                ->where('cpf', $cpf)
                ->first();
        }

        if (! $registroExistente && $cnpj) {
            $registroExistente = UserData::query()
                ->where('cnpj', $cnpj)
                ->first();
        }

        if ($registroExistente) {
            $this->garantirProducerProfile($registroExistente->user_id, $userData);

            return (int) $registroExistente->user_id;
        }

        if (! $cpf && ! $cnpj) {
            throw new InvalidArgumentException('CPF ou CNPJ do produtor é obrigatório para cadastrar um novo produtor.');
        }

        $service = new CreateUserService;

        $user = $service->createUser(
            produtor: $userData,
            role: RoleUser::$PRODUTOR,
            senha: null,
            vendedor: auth()->id()
        );

        $user->userData()->create($userData);

        if (! empty($userData['contato']) && is_array($userData['contato'])) {
            $user->contatos()->create($userData['contato']);
        }

        //        $this->garantirProducerProfile($user->id, $userData);

        return (int) $user->id;
    }

    private function garantirProducerProfile(int $userId, array $data): void
    {
        $cpf = isset($data['cpf']) ? preg_replace('/\D/', '', $data['cpf']) : null;
        $cnpj = isset($data['cnpj']) ? preg_replace('/\D/', '', $data['cnpj']) : null;

        $tipoPessoa = $data['tipo_pessoa'] ?? null;
        $documentField = $tipoPessoa === 'pj' ? 'cnpj' : 'cpf';
        $documentValue = $tipoPessoa === 'pj' ? $cnpj : $cpf;

        if ($documentValue) {
            $existingProfile = ProducerProfile::query()
                ->where($documentField, $documentValue)
                ->first();

            if ($existingProfile) {
                return;
            }
        }

        ProducerProfile::query()->create([
            'tipo_pessoa' => $tipoPessoa ?? 'pf',
            'cpf' => $cpf,
            'cnpj' => $cnpj,
            'nome' => $data['nome'] ?? null,
            'razao_social' => $data['razao_social'] ?? null,
            'nome_fantasia' => $data['nome_fantasia'] ?? null,
            'platform_user_id' => $userId,
            'consultor_user_id' => auth()->id(),
            'status' => 'prospect',
            'is_active_producer' => false,
        ]);
    }
}
