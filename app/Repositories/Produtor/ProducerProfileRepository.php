<?php

namespace App\Repositories\Produtor;

use App\Models\Produtor\ProducerProfile;
use App\src\Roles\RoleUser;

class ProducerProfileRepository
{
    public function queryList()
    {
        $user = auth()->user();

        $query = ProducerProfile::query()
            ->with([
                'user',
                'createdBy',
                'adminAddress',
                'usinaAddress',
            ])
            ->orderByDesc('id');

        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where(function ($subQuery) use ($user) {
                $subQuery->where('created_by_user_id', $user->id)
                    ->orWhereHas('user', function ($userQuery) use ($user) {
                        $userQuery->where('consultor_id', $user->id);
                    });
            });
        }

        if ($user && $user->role_id === RoleUser::$PRODUTOR) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }
}