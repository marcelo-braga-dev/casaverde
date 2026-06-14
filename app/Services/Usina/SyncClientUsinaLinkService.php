<?php

namespace App\Services\Usina;

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Usina\UsinaSolar;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SyncClientUsinaLinkService
{
    public function __construct(
        private readonly RecalculateUsinaEnergyService $recalculateUsinaEnergyService
    ) {}

    public function create(array $data): ClientUsinaLink
    {
        return DB::transaction(function () use ($data) {
            $usina = UsinaSolar::query()
                ->lockForUpdate()
                ->findOrFail($data['usina_id']);

            $requestedEnergy = (float) $data['allocated_energy_kwh'];

            $currentAllocatedEnergy = (float) $usina->clientLinks()
                ->where('is_active', true)
                ->where('status', ClientUsinaLinkStatus::Active->value)
                ->sum('allocated_energy_kwh');

            $remainingEnergy = (float) $usina->energia_disponivel_kwh - $currentAllocatedEnergy;

            if ($requestedEnergy > $remainingEnergy) {
                throw new RuntimeException(
                    'A energia solicitada excede o saldo disponível da usina.'
                );
            }

            if (($data['is_active'] ?? true) === true) {
                ClientUsinaLink::query()
                    ->where('client_profile_id', $data['client_profile_id'])
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'status' => ClientUsinaLinkStatus::Finished->value,
                        'ended_at' => now(),
                        'updated_by_user_id' => auth()->id(),
                    ]);
            }

            $link = ClientUsinaLink::query()->create([
                'client_profile_id' => $data['client_profile_id'],
                'usina_id' => $data['usina_id'],
                'allocated_energy_kwh' => $data['allocated_energy_kwh'],
                'discount_percentage' => $data['discount_percentage'] ?? 0,
                'started_at' => $data['started_at'],
                'ended_at' => $data['ended_at'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'status' => $data['status'] ?? ClientUsinaLinkStatus::Active->value,
                'notes' => $data['notes'] ?? null,
                'created_by_user_id' => auth()->id(),
                'updated_by_user_id' => auth()->id(),
            ]);

            $this->recalculateUsinaEnergyService->handle($usina);

            return $link->load(['clientProfile', 'usina']);
        });
    }

    public function cancel(ClientUsinaLink $link): void
    {
        DB::transaction(function () use ($link) {
            $usina = $link->usina;

            $link->update([
                'is_active' => false,
                'status' => ClientUsinaLinkStatus::Cancelled->value,
                'ended_at' => now(),
                'updated_by_user_id' => auth()->id(),
            ]);

            if ($usina) {
                $this->recalculateUsinaEnergyService->handle($usina);
            }
        });
    }
}
