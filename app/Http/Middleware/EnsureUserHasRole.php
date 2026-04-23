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
            ->with(['adminAddress', 'usinaAddress'])
            ->where('user_id', $user->id)
            ->first();

        $usinas = UsinaSolar::query()
            ->with(['consultor', 'concessionaria', 'block', 'address'])
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->get();

        $leads = ProducerLead::query()
            ->with(['consultor', 'concessionaria'])
            ->whereHas('producerProfile', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Produtor/Dashboard/Page', [
            'producerProfile' => $producerProfile,
            'usinas' => $usinas,
            'leads' => $leads,
        ]);
    }
}