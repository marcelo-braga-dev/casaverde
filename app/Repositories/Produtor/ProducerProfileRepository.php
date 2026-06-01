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
            ->with(['consultor', 'contacts'])
            ->orderByDesc('id');

        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where('consultor_user_id', $user->id);
        }

        if ($user && $user->role_id === RoleUser::$PRODUTOR) {
            $query->where('platform_user_id', $user->id);
        }

        return $query;
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }

    public function findById(int $id): ?ProducerProfile
    {
        return $this->queryList()->find($id);
    }
}
