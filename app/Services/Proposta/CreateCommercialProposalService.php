<?php

namespace App\Services\Proposta;

use App\Models\Cliente\ClientProfile;
use App\Models\Endereco\Address;
use App\Models\Proposta\CommercialProposal;
use Illuminate\Support\Facades\DB;

class CreateCommercialProposalService
{
    public function handle(array $data): array
    {
        return DB::transaction(function () use ($data) {

            // =============================
            // CLIENTE
            // =============================

            $clientAlreadyExists = false;

            if (!empty($data['client_profile_id'])) {
                $client = ClientProfile::find($data['client_profile_id']);
                $clientAlreadyExists = true;
            } else {
                $client = ClientProfile::create([
                    'tipo_pessoa' => $data['tipo_pessoa'],
                    'cpf' => $data['cpf'] ?? null,
                    'cnpj' => $data['cnpj'] ?? null,
                    'nome' => $data['nome'] ?? null,
                    'razao_social' => $data['razao_social'] ?? null,
                    'nome_fantasia' => $data['nome_fantasia'] ?? null,
                    'email' => $data['email'] ?? null,
                    'telefone' => $data['telefone'] ?? null,
                ]);
            }

            // =============================
            // 🔥 ENDEREÇO
            // =============================

            $address = $this->createAddressIfFilled($data['address'] ?? []);

            // =============================
            // PROPOSTA
            // =============================

            $proposal = CommercialProposal::create([
                'client_profile_id' => $client->id,
                'consultor_user_id' => auth()->id(),
                'concessionaria_id' => $data['concessionaria_id'],
                'address_id' => $address?->id, // 🔥 AQUI
                'status' => 'emitida',
                'issued_at' => now(),
                'valid_until' => $data['valid_until'] ?? null,
                'media_consumo' => $data['media_consumo'] ?? null,
                'taxa_reducao' => $data['taxa_reducao'] ?? null,
                'prazo_locacao' => $data['prazo_locacao'] ?? null,
                'valor_medio' => $data['valor_medio'] ?? null,
                'unidade_consumidora' => $data['unidade_consumidora'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            return [
                'proposal' => $proposal,
                'client_already_exists' => $clientAlreadyExists,
                'client_message' => $clientAlreadyExists
                    ? 'Cliente já existente'
                    : 'Cliente criado com sucesso',
            ];
        });
    }

    private function createAddressIfFilled(array $data): ?Address
    {
        $filtered = collect($data)
            ->map(fn ($v) => $v === '' ? null : $v)
            ->filter()
            ->toArray();

        if (empty($filtered)) {
            return null;
        }

        return Address::create($data);
    }
}
