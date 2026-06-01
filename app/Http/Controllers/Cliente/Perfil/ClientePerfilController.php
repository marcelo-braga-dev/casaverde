<?php

namespace App\Http\Controllers\Cliente\Perfil;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use Inertia\Inertia;

class ClientePerfilController extends Controller
{
    public function show()
    {
        $profile = ClientProfile::query()
            ->with([
                'contacts',
                'consultor',
                'activeUsinaLink.usina',
                'activeDiscountRule',
                'discountRules' => fn ($q) => $q->latest()->limit(5),
                'usinaLinks' => fn ($q) => $q->latest()->limit(5),
            ])
            ->where('platform_user_id', auth()->id())
            ->first();

        return Inertia::render('Cliente/Perfil/Show/Page', [
            'profile' => $profile,
            'user'    => auth()->user()->only(['id', 'name', 'email', 'status', 'role_id']),
        ]);
    }
}
