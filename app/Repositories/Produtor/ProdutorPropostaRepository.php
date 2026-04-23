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

            if (!empty($data['endereco']) && is_array($data['endereco'])) {
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

        if (!$registroExistente && $cnpj) {
            $registroExistente = UserData::query()
                ->where('cnpj', $cnpj)
                ->first();
        }

        if ($registroExistente) {
            $this->garantirProducerProfile($registroExistente->user_id, $userData);

            return (int) $registroExistente->user_id;
        }

        if (!$cpf && !$cnpj) {
            throw new InvalidArgumentException('CPF ou CNPJ do produtor é obrigatório para cadastrar um novo produtor.');
        }

        $service = new CreateUserService();

        $user = $service->createUser(
            produtor: $userData,
            role: RoleUser::$PRODUTOR,
            senha: null,
            vendedor: auth()->id()
        );

        $user->userData()->create($userData);

        if (!empty($userData['contato']) && is_array($userData['contato'])) {
            $user->contatos()->create($userData['contato']);
        }

        $this->garantirProducerProfile($user->id, $userData);

        return (int) $user->id;
    }

    private function garantirProducerProfile(int $userId, array $data): void
    {
        $existingProfile = ProducerProfile::query()
            ->where('user_id', $userId)
            ->first();

        if ($existingProfile) {
            return;
        }

        $tipoPessoa = $data['tipo_pessoa'] ?? null;
        $potencia = $data['dados']['potencia'] ?? null;
        $geracaoMedia = $data['dados']['geracao_media'] ?? null;
        $prazoLocacao = $data['dados']['prazo_locacao'] ?? null;

        ProducerProfile::query()->create([
            'user_id' => $userId,
            'created_by_user_id' => auth()->id(),
            'admin_nome' => $data['nome'] ?? $data['razao_social'] ?? null,
            'admin_qualificacao' => $tipoPessoa === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física',
            'usina_nome' => $data['razao_social'] ?? $data['nome_fantasia'] ?? $data['nome'] ?? null,
            'usina_cnpj' => $data['cnpj'] ?? null,
            'potencia_kw' => $potencia,
            'potencia_kwp' => $potencia,
            'geracao_anual' => $geracaoMedia !== null ? ((float) $geracaoMedia * 12) : null,
            'prazo_locacao' => $prazoLocacao,
            'descricao' => 'Perfil criado automaticamente a partir da proposta de produtor.',
            'status' => 'novo',
        ]);
    }
}