<?php

namespace App\Http\Controllers\Produtor;

use App\Http\Controllers\Controller;
use App\Models\Produtor\ProducerLead;
use App\Models\Produtor\ProducerProfile;
use App\Models\Usina\UsinaSolar;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = auth()->user();

        $producerProfile = ProducerProfile::query()
            ->with(['contacts', 'usinas.concessionaria'])
            ->where('platform_user_id', $user->id)
            ->first();

        $usinas = $producerProfile
            ? UsinaSolar::query()
                ->with(['concessionaria', 'block'])
                ->where('producer_profile_id', $producerProfile->id)
                ->orderByDesc('id')
                ->get()
            : collect();

        $leads = $producerProfile
            ? ProducerLead::query()
                ->with(['concessionaria'])
                ->where('producer_profile_id', $producerProfile->id)
                ->orderByDesc('id')
                ->get()
            : collect();

        return Inertia::render('Produtor/Dashboard/Page', [
            'producerProfile' => $producerProfile,
            'usinas' => $usinas,
            'leads' => $leads,
        ]);
    }
}
