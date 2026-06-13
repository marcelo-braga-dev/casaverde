<?php

namespace App\Services\Proposta;

use App\Models\Endereco\Address;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\ProducerProposal;
use App\Services\Config\SystemSettingService;
use App\Services\Produtor\StoreProducerFeeRuleService;
use App\src\Cliente\ClientStatus;
use App\src\Proposta\ProposalStatus;
use Illuminate\Support\Facades\DB;

class CreateProducerProposalService
{
    public function handle(array $data): array
    {
        return DB::transaction(function () use ($data) {

            $clientAlreadyExists = false;

            $defaultFeePercent = (float) app(SystemSettingService::class)
                ->get('default_producer_fee_percentage', 15);

            // =============================
            // CLIENTE
            // =============================

            if (! empty($data['producer_profile_id'])) {

                $client = ProducerProfile::query()
                    ->with('activeFeeRule')
                    ->findOrFail($data['producer_profile_id']);

                $clientAlreadyExists = true;

            } else {

                $client = ProducerProfile::create([
                    'tipo_pessoa' => $data['tipo_pessoa'],
                    'cpf' => $data['cpf'] ?? null,
                    'cnpj' => $data['cnpj'] ?? null,
                    'nome' => $data['nome'] ?? null,
                    'razao_social' => $data['razao_social'] ?? null,
                    'nome_fantasia' => $data['nome_fantasia'] ?? null,
                ]);

                app(StoreProducerFeeRuleService::class)
                    ->handle(
                        producerProfile: $client,
                        feePercent: $defaultFeePercent,
                        startsOn: now()->toDateTimeString(),
                    );

                $client->load('activeFeeRule');
            }

            // =============================
            // ENDEREÇO
            // =============================

            $address = $this->createAddressIfFilled(
                $data['address'] ?? []
            );

            // =============================
            // TAXA DE ADMINISTRAÇÃO ATIVA
            // =============================

            $activeFeeRule = $client->activeFeeRule;

            $feePercent = $activeFeeRule
                ? (float) $activeFeeRule->fee_percent
                : $defaultFeePercent;

            // =============================
            // PROPOSTA
            // =============================

            $proposal = ProducerProposal::create([
                'producer_profile_id' => $client->id,
                'consultor_user_id' => $client->consultor_user_id ?? auth()->user()->id,
                'concessionaria_id' => $data['concessionaria_id'],
                'address_id' => $address?->id,
                'status' => ProposalStatus::EMITIDA,
                'issued_at' => now(),
                'valid_until' => $data['valid_until'] ?? null,
                'media_geracao' => $data['media_geracao'] ?? null,
                'fill_percent' => $feePercent,
                'prazo_contrato' => $data['prazo_contrato'] ?? null,
                'valor_investimento' => $data['valor_investimento'] ?? null,
                'potencia_usina' => $data['potencia_usina'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $client->update(['status' => ClientStatus::PROPOSTA_EMITIDA]);

            return [
                'proposal' => $proposal,
                'producer_already_exists' => $clientAlreadyExists,
                'producer_message' => $clientAlreadyExists
                    ? 'Produtor existente utilizado.'
                    : 'Produtor criado com sucesso.',
            ];
        });
    }

    private function createAddressIfFilled(array $data): ?Address
    {
        $filtered = collect($data)
            ->map(fn ($value) => $value === '' ? null : $value)
            ->filter(fn ($value) => ! is_null($value))
            ->toArray();

        if (empty($filtered)) {
            return null;
        }

        return Address::create($filtered);
    }
}
