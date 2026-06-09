<?php

namespace App\Services\Cliente;

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
        ?int $consumerUnitId = null
    ): ClientUsinaLink {
        return DB::transaction(function () use ($clientProfile, $usinaId, $startedAt, $notes, $consumerUnitId) {
            // Se uma UC foi especificada, encerra apenas o vínculo ativo daquela UC
            // Caso contrário, encerra todos os vínculos ativos do cliente (comportamento legado)
            $query = ClientUsinaLink::query()
                ->where('client_profile_id', $clientProfile->id)
                ->where('is_active', true);

            if ($consumerUnitId) {
                $query->where('consumer_unit_id', $consumerUnitId);
            }

            $query->update([
                'is_active' => false,
                'ended_at'  => $startedAt,
            ]);

            return ClientUsinaLink::create([
                'client_profile_id' => $clientProfile->id,
                'consumer_unit_id'  => $consumerUnitId,
                'usina_id'          => $usinaId,
                'started_at'        => $startedAt,
                'notes'             => $notes,
                'is_active'         => true,
            ]);
        });
    }
}
