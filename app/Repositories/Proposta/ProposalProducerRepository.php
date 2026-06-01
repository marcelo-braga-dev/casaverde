<?php

namespace App\Repositories\Proposta;

use App\Models\Proposta\ProducerProposal;
use App\src\Roles\RoleUser;

class ProposalProducerRepository
{
    public function queryList(array $filters = [])
    {
        $user = auth()->user();

        $query = ProducerProposal::query()
            ->with(['producerProfile', 'consultor', 'concessionaria'])
            ->orderByDesc('id');

        // Filtro por role
        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where('consultor_user_id', $user->id);
        }

        // Busca textual
        if (!empty($filters['search'])) {
            $search = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($search) {
                $q->whereHas('producerProfile', fn ($p) =>
                    $p->where('nome', 'like', $search)
                      ->orWhere('razao_social', 'like', $search)
                      ->orWhere('cpf', 'like', $search)
                      ->orWhere('cnpj', 'like', $search)
                );
            });
        }

        // Status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query;
    }

    public function paginate(int $perPage = 15, array $filters = [])
    {
        return $this->queryList($filters)->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): ?ProducerProposal
    {
        return $this->queryList()->find($id);
    }
}
