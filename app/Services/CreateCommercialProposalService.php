<?php

namespace App\Services\Proposta;

use App\Models\Proposta\CommercialProposal;
use App\Services\Cliente\CreateOrFindClientProfileService;
use Illuminate\Support\Facades\DB;

class CreateCommercialProposalService
{
    public function __construct(
        private readonly CreateOrFindClientProfileService $createOrFindClientProfileService
    ) {
    }

    public function handle(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $clientResult = $this->createOrFindClientProfileService->handle([
                'tipo_pessoa' => $data['tipo_pessoa'],
                'cpf' => $data['cpf'] ?? null,
                'cnpj' => $data['cnpj'] ?? null,
                'nome' => $data['nome'] ?? null,
                'razao_social' => $data['razao_social'] ?? null,
                'nome_fantasia' => $data['nome_fantasia'] ?? null,
                'cidade' => $data['cidade'],
                'email' => $data['email'] ?? null,
                'telefone' => $data['telefone'] ?? null,
                'status' => 'proposta_emitida',
            ]);

            $clientProfile = $clientResult['client_profile'];

            if ($clientProfile->status === 'prospect') {
                $clientProfile->update([
                    'status' => 'proposta_emitida',
                ]);
            }

            $proposal = CommercialProposal::create([
                'client_profile_id' => $clientProfile->id,
                'consultor_user_id' => auth()->id(),
                'concessionaria_id' => $data['concessionaria_id'],
                'status' => 'emitida',
                'issued_at' => now()->toDateString(),
                'valid_until' => $data['valid_until'] ?? null,
                'media_consumo' => $data['media_consumo'] ?? null,
                'taxa_reducao' => $data['taxa_reducao'] ?? null,
                'prazo_locacao' => $data['prazo_locacao'] ?? null,
                'valor_medio' => $data['valor_medio'] ?? null,
                'unidade_consumidora' => $data['unidade_consumidora'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            return [
                'proposal' => $proposal->load(['clientProfile', 'consultor', 'concessionaria']),
                'client_profile' => $clientProfile,
                'client_already_exists' => $clientResult['already_exists'],
                'client_message' => $clientResult['message'],
            ];
        });
    }
}