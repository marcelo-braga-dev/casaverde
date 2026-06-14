<?php

namespace App\Repositories\Cliente;

use App\Models\Cliente\ConsumerUnit;
use App\src\Roles\RoleUser;

class ConsumerUnitRepository
{
    public function queryList(array $filters = [])
    {
        $user = auth()->user();

        $query = ConsumerUnit::query()
            ->with([
                'clientProfile',
                'concessionaria',
                'activeUsinaLink.usina.produtor',
            ])
            ->orderByDesc('id');

        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->whereHas('clientProfile', function ($q) use ($user) {
                $q->where('consultor_user_id', $user->id);
            });
        }

        if (! empty($filters['client_profile_id'])) {
            $query->where('client_profile_id', $filters['client_profile_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);

            $query->where(function ($q) use ($search) {
                $q->where('uc_code', 'like', "%{$search}%")
                    ->orWhere('label', 'like', "%{$search}%")
                    ->orWhereHas('clientProfile', function ($sub) use ($search) {
                        $sub->where('nome', 'like', "%{$search}%")
                            ->orWhere('razao_social', 'like', "%{$search}%")
                            ->orWhere('nome_fantasia', 'like', "%{$search}%")
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
}
