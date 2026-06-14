<?php

namespace App\Services\Usina;

use App\Models\Usina\UsinaGenerationRecord;
use App\Models\Usina\UsinaSolar;
use Illuminate\Support\Facades\DB;

class UpsertUsinaGenerationRecordService
{
    public function __construct(
        private readonly RecalculateUsinaEnergyService $recalculateUsinaEnergyService
    ) {}

    public function handle(array $data): UsinaGenerationRecord
    {
        return DB::transaction(function () use ($data) {
            $record = UsinaGenerationRecord::query()->updateOrCreate(
                [
                    'usina_id' => $data['usina_id'],
                    'reference_year' => $data['reference_year'],
                    'reference_month' => $data['reference_month'],
                ],
                [
                    'generated_energy_kwh' => $data['generated_energy_kwh'] ?? 0,
                    'injected_energy_kwh' => $data['injected_energy_kwh'] ?? 0,
                    'compensated_energy_kwh' => $data['compensated_energy_kwh'] ?? 0,
                    'available_energy_kwh' => $data['available_energy_kwh'] ?? 0,
                    'notes' => $data['notes'] ?? null,
                    'created_by_user_id' => auth()->id(),
                    'updated_by_user_id' => auth()->id(),
                ]
            );

            $usina = UsinaSolar::query()
                ->lockForUpdate()
                ->findOrFail($data['usina_id']);

            $usina->forceFill([
                'media_geracao' => $record->generated_energy_kwh,
                'energia_disponivel_kwh' => $record->available_energy_kwh,
            ])->save();

            $this->recalculateUsinaEnergyService->handle($usina);

            return $record->refresh()->load('usina');
        });
    }
}
