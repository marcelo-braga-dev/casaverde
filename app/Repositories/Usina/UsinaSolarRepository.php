<?php

namespace App\Repositories\Usina;

use App\Models\Usina\UsinaSolar;
use App\src\Roles\RoleUser;

class UsinaSolarRepository
{
    public function queryList(array $filters = [])
    {
        $user = auth()->user();

        $query = UsinaSolar::query()
            ->with(['produtor', 'consultor', 'concessionaria', 'block', 'address'])
            ->orderByDesc('id');

        // Filtro por role — consultor vê só suas usinas
        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->where('consultor_user_id', $user->id);
        }

        // Busca textual
        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('usina_nome', 'like', $search)
                    ->orWhere('uc', 'like', $search)
                    ->orWhereHas('produtor', fn ($p) => $p->where('nome', 'like', $search)
                        ->orWhere('razao_social', 'like', $search)
                    )
                    ->orWhereHas('concessionaria', fn ($c) => $c->where('nome', 'like', $search)
                    );
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
}
