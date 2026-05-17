<?php

namespace App\Services\Proposta;

use App\Models\Cliente\ClientProfile;
use App\Models\Endereco\Address;
use App\Models\Proposta\CommercialProposal;
use App\Services\Cliente\StoreDiscountRuleService;
use App\Services\Config\SystemSettingService;
use App\src\Cliente\ClientStatus;
use App\src\Proposta\ProposalStatus;
use Illuminate\Support\Facades\DB;

class CreateCommercialProposalService
{
    public function handle(array $data): array
    {
        return DB::transaction(function () use ($data) {

            $clientAlreadyExists = false;

            $defaultDiscount = (float) app(SystemSettingService::class)
                ->get('default_discount_percentage', 20);

            // =============================
            // CLIENTE
            // =============================

            if (!empty($data['client_profile_id'])) {

                $client = ClientProfile::query()
                    ->with('activeDiscountRule')
                    ->findOrFail($data['client_profile_id']);

                $clientAlreadyExists = true;

            } else {

                $client = ClientProfile::create([
                    'tipo_pessoa' => $data['tipo_pessoa'],
                    'cpf' => $data['cpf'] ?? null,
                    'cnpj' => $data['cnpj'] ?? null,
                    'nome' => $data['nome'] ?? null,
                    'razao_social' => $data['razao_social'] ?? null,
                    'nome_fantasia' => $data['nome_fantasia'] ?? null,
                ]);

                app(StoreDiscountRuleService::class)
                    ->handle(
                        clientProfile: $client,
                        discountPercent: $defaultDiscount,
                        startsOn: now()->toDateTimeString(),
                    );

                $client->load('activeDiscountRule');
            }

            // =============================
            // ENDEREÇO
            // =============================

            $address = $this->createAddressIfFilled(
                $data['address'] ?? []
            );

            // =============================
            // DESCONTO ATIVO
            // =============================

            $activeDiscount = $client->activeDiscountRule;

            $discountPercent = $activeDiscount
                ? (float) $activeDiscount->discount_percent
                : $defaultDiscount;

            // =============================
            // PROPOSTA
            // =============================

            $proposal = CommercialProposal::create([
                'client_profile_id' => $client->id,
                'consultor_user_id' => $client->consultor_user_id,
                'concessionaria_id' => $data['concessionaria_id'],
                'address_id' => $address?->id,
                'status' => ProposalStatus::EMITIDA,
                'issued_at' => now(),
                'valid_until' => $data['valid_until'] ?? null,
                'media_consumo' => $data['media_consumo'] ?? null,
                'discount_percent' => $discountPercent,
                'prazo_locacao' => $data['prazo_locacao'] ?? null,
                'valor_medio' => $data['valor_medio'] ?? null,
                'unidade_consumidora' => $data['unidade_consumidora'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $client->update(['status' => ClientStatus::PROPOSTA_EMITIDA]);

            return [
                'proposal' => $proposal,
                'client_already_exists' => $clientAlreadyExists,
                'client_message' => $clientAlreadyExists
                    ? 'Cliente existente utilizado.'
                    : 'Cliente criado com sucesso.',
            ];
        });
    }

    private function createAddressIfFilled(array $data): ?Address
    {
        $filtered = collect($data)
            ->map(fn ($value) => $value === '' ? null : $value)
            ->filter(fn ($value) => !is_null($value))
            ->toArray();

        if (empty($filtered)) {
            return null;
        }

        return Address::create($filtered);
    }
}
