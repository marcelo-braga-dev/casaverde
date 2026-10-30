<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Enums\Usina\UsinaOnboardingStage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\UpdateUsinaOnboardingStageRequest;
use App\Models\Usina\UsinaSolar;
use App\Services\Usina\MoveUsinaOnboardingStageService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminUsinaOnboardingController extends Controller
{
    // Cartão parado na mesma etapa por mais que isso aparece em destaque no quadro.
    private const STALLED_AFTER_DAYS = 14;

    // Concluídas somem do quadro depois desse prazo, para a última coluna não crescer para sempre.
    private const COMPLETED_VISIBLE_DAYS = 30;

    public function index(): Response
    {
        $usinas = UsinaSolar::query()
            ->with(['produtor', 'consultor:id,name', 'concessionaria:id,nome'])
            ->whereNotNull('onboarding_stage')
            ->where(function ($query) {
                $query->where('onboarding_stage', '!=', UsinaOnboardingStage::Completed->value)
                    ->orWhere('onboarding_stage_changed_at', '>=', now()->subDays(self::COMPLETED_VISIBLE_DAYS));
            })
            ->orderBy('onboarding_stage_changed_at')
            ->get()
            ->map(fn (UsinaSolar $usina) => [
                'id' => $usina->id,
                'usina_nome' => $usina->usina_nome,
                'potencia_usina' => (float) $usina->potencia_usina,
                'media_geracao' => (float) $usina->media_geracao,
                'produtor' => $usina->produtor?->display_name,
                'consultor' => $usina->consultor?->name,
                'concessionaria' => $usina->concessionaria?->nome,
                'stage' => $usina->onboarding_stage->value,
                'days_in_stage' => $usina->onboarding_stage_changed_at
                    ? (int) $usina->onboarding_stage_changed_at->diffInDays(now())
                    : null,
            ])
            ->values();

        return Inertia::render('Admin/Usina/Onboarding/Page', [
            'stages' => UsinaOnboardingStage::options(),
            'usinas' => $usinas,
            'availableUsinas' => UsinaSolar::query()
                ->whereNull('onboarding_stage')
                ->orderBy('usina_nome')
                ->get(['id', 'usina_nome']),
            'stalledAfterDays' => self::STALLED_AFTER_DAYS,
        ]);
    }

    public function update(
        UpdateUsinaOnboardingStageRequest $request,
        UsinaSolar $usina,
        MoveUsinaOnboardingStageService $service,
    ): RedirectResponse {
        $stage = UsinaOnboardingStage::from($request->validated('stage'));

        $service->handle($usina, $stage);

        return redirect()
            ->back()
            ->with('success', "{$usina->usina_nome}: {$stage->label()}.");
    }
}
