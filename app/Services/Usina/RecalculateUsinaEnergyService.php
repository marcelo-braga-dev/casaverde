<?php

namespace App\Services\Usina;

use App\Models\Usina\UsinaSolar;

class RecalculateUsinaEnergyService
{
    public function handle(UsinaSolar $usina): UsinaSolar
    {
        $allocatedEnergy = (float) $usina->clientLinks()
            ->where('is_active', true)
            ->where('status', 'active')
            ->sum('allocated_energy_kwh');

        $availableEnergy = (float) $usina->energia_disponivel_kwh;

        $usina->forceFill([
            'energia_alocada_kwh' => $allocatedEnergy,
            'energia_saldo_kwh' => max(0, $availableEnergy - $allocatedEnergy),
        ])->save();

        return $usina->refresh();
    }
}
