<?php

namespace App\Services\Cliente;

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use Illuminate\Support\Facades\DB;

class AttachClientToUsinaService
{
    public function handle(ClientProfile $clientProfile, int $usinaId, string $startedAt, ?string $notes = null): ClientUsinaLink
    {
        return DB::transaction(function () use ($clientProfile, $usinaId, $startedAt, $notes) {
            ClientUsinaLink::query()
                ->where('client_profile_id', $clientProfile->id)
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'ended_at' => $startedAt,
                ]);

            return ClientUsinaLink::create([
                'client_profile_id' => $clientProfile->id,
                'usina_id' => $usinaId,
                'started_at' => $startedAt,
                'notes' => $notes,
                'is_active' => true,
            ]);
        });
    }
}