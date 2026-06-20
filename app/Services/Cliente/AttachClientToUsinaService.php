<?php

namespace App\Services\Cliente;

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use Illuminate\Support\Facades\DB;

class AttachClientToUsinaService
{
    public function handle(
        ClientProfile $clientProfile,
        int $usinaId,
        string $startedAt,
        ?string $notes = null,
        ?int $consumerUnitId = null,
        float $consumptionPercentage = 100.0
    ): ClientUsinaLink {
        return DB::transaction(function () use ($clientProfile, $usinaId, $startedAt, $notes, $consumerUnitId, $consumptionPercentage) {
            $query = ClientUsinaLink::query()
                ->where('client_profile_id', $clientProfile->id)
                ->where('is_active', true);

            if ($consumerUnitId) {
                // UC informada: encerra apenas o vínculo ativo desta UC com a MESMA usina
                // (re-vínculo/atualização). Vínculos ativos com outras usinas são preservados,
                // permitindo que a UC tenha consumo alocado em múltiplas usinas simultaneamente.
                $query->where('consumer_unit_id', $consumerUnitId)
                    ->where('usina_id', $usinaId);
            }
            // Sem UC informada: encerra todos os vínculos ativos do cliente (comportamento legado)

            $query->update([
                'is_active' => false,
                'ended_at' => $startedAt,
            ]);

            return ClientUsinaLink::create([
                'client_profile_id' => $clientProfile->id,
                'consumer_unit_id' => $consumerUnitId,
                'usina_id' => $usinaId,
                'started_at' => $startedAt,
                'notes' => $notes,
                'is_active' => true,
                'consumption_percentage' => $consumptionPercentage,
            ]);
        });
    }

    public function endLink(ClientUsinaLink $link): void
    {
        $link->update([
            'is_active' => false,
            'status' => ClientUsinaLinkStatus::Finished,
            'ended_at' => now(),
        ]);
    }
}
