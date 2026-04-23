<?php

namespace App\Repositories\Proposta;

use App\Models\Proposta\CommercialProposal;
use App\src\Roles\RoleUser;

class CommercialProposalRepository
{
    public function queryList()
    {
        $user = auth()->user();

        $query = CommercialProposal::query()
            ->with(['clientProfile', 'consultor', 'concessionaria'])
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

    public function findById(int $id): ?CommercialProposal
    {
        return $this->queryList()->find($id);
    }
}