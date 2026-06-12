<?php

namespace App\Services\Fatura;

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;

class ResolveConsumerUnitService
{
    /**
     * Localiza a UC do cliente pelo código informado/lido no PDF.
     * Caso não exista nenhuma UC cadastrada com esse código para o cliente,
     * cria uma nova UC (status active) para que a fatura sempre fique vinculada a uma UC.
     */
    public function handle(ClientProfile $clientProfile, ?string $ucCode): ?ConsumerUnit
    {
        $normalized = ConsumerUnit::normalizeCode($ucCode);

        if (!$normalized) {
            return null;
        }

        return ConsumerUnit::query()
            ->where('client_profile_id', $clientProfile->id)
            ->where('uc_code', $normalized)
            ->first()
            ?? ConsumerUnit::create([
                'client_profile_id' => $clientProfile->id,
                'uc_code' => $normalized,
                'status' => 'active',
            ]);
    }
}
