<?php

namespace App\Repositories\Pagamento;

use App\Models\Pagamento\PaymentWebhookEvent;

class PaymentWebhookEventRepository
{
    public function queryList(array $filters = [])
    {
        $query = PaymentWebhookEvent::query()
            ->with(['paymentSlip.charge.clientProfile'])
            ->orderByDesc('id');

        if (!empty($filters['provider'])) {
            $query->where('provider', $filters['provider']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['event_type'])) {
            $query->where('event_type', 'like', '%' . $filters['event_type'] . '%');
        }

        if (!empty($filters['provider_payment_id'])) {
            $query->where('provider_payment_id', 'like', '%' . $filters['provider_payment_id'] . '%');
        }

        return $query;
    }

    public function paginate(array $filters = [], int $perPage = 20)
    {
        return $this->queryList($filters)->paginate($perPage)->withQueryString();
    }
}
