<?php

namespace App\Http\Controllers\Cliente\Usina;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Usina\UsinaGenerationRecord;
use Inertia\Inertia;

class ClienteUsinaController extends Controller
{
    public function show()
    {
        $profile = ClientProfile::query()
            ->with(['activeUsinaLink.usina.concessionaria'])
            ->where('platform_user_id', auth()->id())
            ->first();

        $usina = $profile?->activeUsinaLink?->usina;

        $historico = $usina
            ? UsinaGenerationRecord::query()
                ->where('usina_id', $usina->id)
                ->orderByDesc('reference_year')
                ->orderByDesc('reference_month')
                ->limit(24)
                ->get([
                    'usina_id',
                    'reference_year',
                    'reference_month',
                    'generated_energy_kwh',
                    'compensated_energy_kwh',
                    'available_energy_kwh',
                ])
                ->toArray()
            : [];

        return Inertia::render('Cliente/Usina/Show/Page', [
            'profile' => $profile,
            'usina' => $usina,
            'link' => $profile?->activeUsinaLink,
            'historico' => $historico,
        ]);
    }
}
