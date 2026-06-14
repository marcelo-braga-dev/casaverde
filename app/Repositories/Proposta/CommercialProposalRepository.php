<?php

namespace App\Repositories\Proposta;

use App\Models\Proposta\CommercialProposal;
use App\src\Roles\RoleUser;

class CommercialProposalRepository
{
    public function queryList(array $filters = [])
    {
        $user = auth()->user();

        $query = CommercialProposal::query()
            ->with(['clientProfile', 'consultor', 'concessionaria'])
            ->orderByDesc('id');

        // Filtro por role
        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where('consultor_user_id', $user->id);
        }

        // Busca textual (código, nome do cliente, UC)
        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->whereHas('clientProfile', fn ($c) => $c->where('nome', 'like', $search)
                    ->orWhere('razao_social', 'like', $search)
                    ->orWhere('cpf', 'like', $search)
                    ->orWhere('cnpj', 'like', $search)
                )
                    ->orWhere('unidade_consumidora', 'like', $search);
            });
        }

        // Status
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Concessionária
        if (! empty($filters['concessionaria_id'])) {
            $query->where('concessionaria_id', $filters['concessionaria_id']);
        }

        return $query;
    }

    public function paginate(int $perPage = 15, array $filters = [])
    {
        return $this->queryList($filters)->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): ?CommercialProposal
    {
        return $this->queryList()->find($id);
    }
}
