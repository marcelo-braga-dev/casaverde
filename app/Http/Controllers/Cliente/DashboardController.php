<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Energia\EnergyBill;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = auth()->user();

        $profile = ClientProfile::query()
            ->where('platform_user_id', $user->id)
            ->first();

        $energyBills = EnergyBill::query()
            ->where('user_id', $user->id)
            ->latest('id')
            ->limit(12)
            ->get();

        return Inertia::render('Cliente/Dashboard/Page', [
            'profile' => $profile,
            'energyBills' => $energyBills,
        ]);
    }
}