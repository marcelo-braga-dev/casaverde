<?php

namespace App\Repositories\Cliente;

use App\Models\Cliente\ClientProfile;
use App\src\Roles\RoleUser;

class ClientProfileRepository
{
    public function queryList()
    {
        $user = auth()->user();

        $query = ClientProfile::query()
            ->with([
                'consultor',
                'platformUser',
                'activeUsinaLink.usina',
                'activeDiscountRule',
            ]);

        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where('consultor_user_id', $user->id);
        }

        if ($user && $user->role_id === RoleUser::$CLIENTE) {
            $query->where('platform_user_id', $user->id);
        }

        return $query->orderByDesc('id');
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }

    public function findById(int $id): ?ClientProfile
    {
        return $this->queryList()->find($id);
    }
}