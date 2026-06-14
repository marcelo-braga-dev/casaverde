<?php

namespace App\Repositories\Produtor;

use App\Models\Produtor\ProducerProfile;
use App\src\Roles\RoleUser;

class ProducerProfileRepository
{
    public function queryList(array $filters = [])
    {
        $user = auth()->user();

        $query = ProducerProfile::query()
            ->with(['consultor', 'contacts'])
            ->orderByDesc('id');

        // Filtro por role
        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where('consultor_user_id', $user->id);
        }

        if ($user && $user->role_id === RoleUser::$PRODUTOR) {
            $query->where('platform_user_id', $user->id);
        }

        // Busca textual
        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', $search)
                    ->orWhere('razao_social', 'like', $search)
                    ->orWhere('nome_fantasia', 'like', $search)
                    ->orWhere('cpf', 'like', $search)
                    ->orWhere('cnpj', 'like', $search)
                    ->orWhereHas('contacts', fn ($c) => $c->where('email', 'like', $search)
                        ->orWhere('celular', 'like', $search));
            });
        }

        // Tipo de pessoa
        if (! empty($filters['tipo_pessoa'])) {
            $query->where('tipo_pessoa', $filters['tipo_pessoa']);
        }

        // Status
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query;
    }

    public function paginate(int $perPage = 15, array $filters = [])
    {
        return $this->queryList($filters)->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): ?ProducerProfile
    {
        return $this->queryList()->find($id);
    }
}
