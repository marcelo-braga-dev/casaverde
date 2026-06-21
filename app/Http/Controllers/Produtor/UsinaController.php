<?php

namespace App\Http\Controllers\Produtor;

use App\Http\Controllers\Controller;
use App\Models\Produtor\ProducerProfile;
use App\Models\Usina\UsinaSolar;
use Inertia\Inertia;

class UsinaController extends Controller
{
    private function getProfile()
    {
        return ProducerProfile::query()
            ->where('platform_user_id', auth()->id())
            ->first();
    }

    public function index()
    {
        $profile = $this->getProfile();

        $usinas = $profile
            ? UsinaSolar::query()
                ->with(['concessionaria', 'block'])
                ->where('producer_profile_id', $profile->id)
                ->orderByDesc('id')
                ->paginate(15)
            : collect();

        return Inertia::render('Produtor/Usinas/Index/Page', [
            'usinas' => $usinas,
            'profile' => $profile,
        ]);
    }

    public function show(UsinaSolar $usina)
    {
        $profile = $this->getProfile();

        abort_if(
            $usina->producer_profile_id !== $profile?->id,
            403,
            'Acesso não autorizado a esta usina.'
        );

        $usina->load([
            'concessionaria',
            'block',
            'address',
            'generationRecords' => fn ($q) => $q->orderByDesc('reference_year')
                ->orderByDesc('reference_month')
                ->limit(24),
        ]);

        return Inertia::render('Produtor/Usinas/Show/Page', [
            'usina' => $usina,
            'profile' => $profile,
        ]);
    }
}
