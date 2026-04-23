<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produtor\ProducerLead;
use App\Models\Produtor\ProducerProfile;
use App\Models\Usina\UsinaSolar;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = auth()->user();

        $consultoresCount = User::query()
            ->where('role_id', RoleUser::$CONSULTOR)
            ->count();

        $clientesCount = User::query()
            ->where('role_id', RoleUser::$CLIENTE)
            ->count();

        $produtoresCount = User::query()
            ->where('role_id', RoleUser::$PRODUTOR)
            ->count();

        $usinasQuery = UsinaSolar::query();
        $producerLeadsQuery = ProducerLead::query();
        $producerProfilesQuery = ProducerProfile::query();

        if ($user->isConsultor()) {
            $usinasQuery->where('consultor_user_id', $user->id);
            $producerLeadsQuery->where('consultor_user_id', $user->id);
            $producerProfilesQuery->where(function ($query) use ($user) {
                $query->where('created_by_user_id', $user->id)
                    ->orWhereHas('user', function ($subQuery) use ($user) {
                        $subQuery->where('consultor_id', $user->id);
                    });
            });
        }

        return Inertia::render('Admin/Dashboard/Page', [
            'stats' => [
                'consultores' => $consultoresCount,
                'clientes' => $clientesCount,
                'produtores' => $produtoresCount,
                'usinas' => $usinasQuery->count(),
                'producerLeads' => $producerLeadsQuery->count(),
                'producerProfiles' => $producerProfilesQuery->count(),
            ],
        ]);
    }
}