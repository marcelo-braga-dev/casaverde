<?php

namespace App\Repositories\Cliente;

use App\Models\Cliente\ClientProfile;
use App\src\Roles\RoleUser;

class ClientProfileRepository
{
    public function queryList(array $filters = [])
    {
        $user = auth()->user();

        $query = ClientProfile::query()
            ->with([
                'consultor',
                'platformUser',
                'activeUsinaLink.usina',
                'activeDiscountRule',
                'contacts',
            ]);

        // Filtro por role
        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where('consultor_user_id', $user->id);
        }

        if ($user && $user->role_id === RoleUser::$CLIENTE) {
            $query->where('platform_user_id', $user->id);
        }

        // Busca textual
        if (!empty($filters['search'])) {
            $search = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', $search)
                  ->orWhere('razao_social', 'like', $search)
                  ->orWhere('nome_fantasia', 'like', $search)
                  ->orWhere('cpf', 'like', $search)
                  ->orWhere('cnpj', 'like', $search)
                  ->orWhere('client_code', 'like', $search)
                  ->orWhereHas('contacts', fn ($c) => $c->where('email', 'like', $search)
                      ->orWhere('celular', 'like', $search));
            });
        }

        // Tipo de pessoa
        if (!empty($filters['tipo_pessoa'])) {
            $query->where('tipo_pessoa', $filters['tipo_pessoa']);
        }

        // Status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('id');
    }

    public function paginate(int $perPage = 15, array $filters = [])
    {
        return $this->queryList($filters)->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): ?ClientProfile
    {
        return $this->queryList()->find($id);
    }
}
