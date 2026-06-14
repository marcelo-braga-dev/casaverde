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
            ->with(['consultor', 'contacts', 'usinas.concessionaria'])
            ->where('platform_user_id', $user->id)
            ->first();

        $usinas = $producerProfile
            ? UsinaSolar::query()
                ->with(['consultor', 'concessionaria', 'block'])
                ->where('producer_profile_id', $producerProfile->id)
                ->orderByDesc('id')
                ->get()
            : collect();

        $leads = $producerProfile
            ? ProducerLead::query()
                ->with(['consultor', 'concessionaria'])
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
