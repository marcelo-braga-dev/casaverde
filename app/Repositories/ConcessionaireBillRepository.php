<?php

namespace App\Repositories\Fatura;

use App\Models\Fatura\ConcessionaireBill;
use App\src\Roles\RoleUser;

class ConcessionaireBillRepository
{
    public function queryList(array $filters = [])
    {
        $user = auth()->user();

        $query = ConcessionaireBill::query()
            ->with([
                'clientProfile',
                'usina',
                'createdBy',
                'reviewedBy',
                'openIssues',
            ])
            ->orderByDesc('id');

        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->whereHas('clientProfile', function ($q) use ($user) {
                $q->where('consultor_user_id', $user->id);
            });
        }

        if (!empty($filters['client_profile_id'])) {
            $query->where('client_profile_id', $filters['client_profile_id']);
        }

        if (!empty($filters['usina_id'])) {
            $query->where('usina_id', $filters['usina_id']);
        }

        if (!empty($filters['reference_label'])) {
            $query->where('reference_label', $filters['reference_label']);
        }

        if (!empty($filters['review_status'])) {
            $query->where('review_status', $filters['review_status']);
        }

        if (!empty($filters['parser_status'])) {
            $query->where('parser_status', $filters['parser_status']);
        }

        if (!empty($filters['import_source'])) {
            $query->where('import_source', $filters['import_source']);
        }

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);

            $query->where(function ($q) use ($search) {
                $q->where('unidade_consumidora', 'like', "%{$search}%")
                    ->orWhere('numero_instalacao', 'like', "%{$search}%")
                    ->orWhere('reference_label', 'like', "%{$search}%")
                    ->orWhereHas('clientProfile', function ($sub) use ($search) {
                        $sub->where('nome', 'like', "%{$search}%")
                            ->orWhere('razao_social', 'like', "%{$search}%")
                            ->orWhere('cpf', 'like', "%{$search}%")
                            ->orWhere('cnpj', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    public function paginate(array $filters = [], int $perPage = 20)
    {
        return $this->queryList($filters)->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): ?ConcessionaireBill
    {
        return ConcessionaireBill::query()
            ->with([
                'clientProfile',
                'usina',
                'createdBy',
                'reviewedBy',
                'issues',
            ])
            ->find($id);
    }
}