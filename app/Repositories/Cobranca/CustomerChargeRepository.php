<?php

namespace App\Repositories\Cobranca;

use App\Models\Cobranca\CustomerCharge;

class CustomerChargeRepository
{
    public function queryList(array $filters = [])
    {
        $query = CustomerCharge::query()
            ->with([
                'clientProfile',
                'usina',
                'concessionaria',
                'bill',
            ])
            ->orderByDesc('id');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['client_profile_id'])) {
            $query->where('client_profile_id', $filters['client_profile_id']);
        }

        if (! empty($filters['client_name'])) {
            $name = $filters['client_name'];

            $query->whereHas('clientProfile', function ($q) use ($name) {
                $q->where('nome', 'like', "%{$name}%")
                    ->orWhere('razao_social', 'like', "%{$name}%")
                    ->orWhere('nome_fantasia', 'like', "%{$name}%");
            });
        }

        if (! empty($filters['reference_year'])) {
            $query->where('reference_year', $filters['reference_year']);
        }

        if (! empty($filters['reference_month'])) {
            $query->where('reference_month', $filters['reference_month']);
        }

        return $query;
    }

    public function paginate(array $filters = [], int $perPage = 20)
    {
        return $this->queryList($filters)->paginate($perPage)->withQueryString();
    }
}
