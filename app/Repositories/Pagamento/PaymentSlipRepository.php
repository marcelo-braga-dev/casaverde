<?php

namespace App\Repositories\Pagamento;

use App\Models\Pagamento\PaymentSlip;

class PaymentSlipRepository
{
    public function queryList(array $filters = [])
    {
        $query = PaymentSlip::query()
            ->with(['charge.clientProfile', 'providerAccount'])
            ->orderByDesc('id');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['provider'])) {
            $query->where('provider', $filters['provider']);
        }

        if (! empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        if (! empty($filters['due_date_start'])) {
            $query->whereDate('due_date', '>=', $filters['due_date_start']);
        }

        if (! empty($filters['due_date_end'])) {
            $query->whereDate('due_date', '<=', $filters['due_date_end']);
        }

        if (! empty($filters['client_name'])) {
            $name = $filters['client_name'];

            $query->whereHas('charge.clientProfile', function ($q) use ($name) {
                $q->where('nome', 'like', "%{$name}%")
                    ->orWhere('razao_social', 'like', "%{$name}%")
                    ->orWhere('nome_fantasia', 'like', "%{$name}%");
            });
        }

        return $query;
    }

    public function paginate(array $filters = [], int $perPage = 20)
    {
        return $this->queryList($filters)->paginate($perPage)->withQueryString();
    }
}
