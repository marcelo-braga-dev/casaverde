<?php

namespace App\Repositories\Produtor;

use App\Models\Produtor\ProducerLead;
use App\src\Roles\RoleUser;

class ProducerLeadRepository
{
    public function queryList()
    {
        $user = auth()->user();

        $query = ProducerLead::query()
            ->with(['consultor', 'producerProfile', 'concessionaria'])
            ->orderByDesc('id');

        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where('consultor_user_id', $user->id);
        }

        return $query;
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }
}