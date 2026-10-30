<?php

namespace App\Services\Usina;

use App\Enums\Usina\UsinaOnboardingStage;
use App\Models\Usina\UsinaSolar;

class MoveUsinaOnboardingStageService
{
    public function handle(UsinaSolar $usina, UsinaOnboardingStage $stage): UsinaSolar
    {
        // Mover para a mesma etapa não reinicia a contagem de dias parada.
        if ($usina->onboarding_stage === $stage) {
            return $usina;
        }

        $usina->forceFill([
            'onboarding_stage' => $stage,
            'onboarding_stage_changed_at' => now(),
        ])->save();

        return $usina;
    }
}
