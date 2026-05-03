<?php

namespace App\Services\Pagamento\Providers\Cora;

class CoraWebhookPayloadMapper
{
    public function eventId(array $payload): ?string
    {
        return $payload['id']
            ?? $payload['event_id']
            ?? $payload['notification_id']
            ?? null;
    }

    public function eventType(array $payload): ?string
    {
        return $payload['event']
            ?? $payload['event_type']
            ?? $payload['type']
            ?? null;
    }

    public function providerPaymentId(array $payload): ?string
    {
        return $payload['invoice']['id']
            ?? $payload['resource']['id']
            ?? $payload['payment']['id']
            ?? $payload['id']
            ?? null;
    }

    public function status(array $payload): ?string
    {
        return $payload['invoice']['status']
            ?? $payload['resource']['status']
            ?? $payload['payment']['status']
            ?? $payload['status']
            ?? null;
    }

    public function transactionId(array $payload): ?string
    {
        return $payload['transaction']['id']
            ?? $payload['payment']['transaction_id']
            ?? $payload['transaction_id']
            ?? $payload['id']
            ?? null;
    }

    public function paidAmount(array $payload): ?float
    {
        $amount = $payload['invoice']['paid_amount']
            ?? $payload['payment']['amount']
            ?? $payload['amount']
            ?? null;

        if ($amount === null) {
            return null;
        }

        $amount = (float) $amount;

        if ($amount > 9999) {
            return $amount / 100;
        }

        return $amount;
    }

    public function paidAt(array $payload): ?string
    {
        return $payload['invoice']['paid_at']
            ?? $payload['payment']['paid_at']
            ?? $payload['paid_at']
            ?? null;
    }

    public function isPaid(array $payload): bool
    {
        return in_array(strtolower((string) $this->status($payload)), [
            'paid',
            'payed',
            'settled',
            'confirmed',
        ], true);
    }

    public function isCancelled(array $payload): bool
    {
        return in_array(strtolower((string) $this->status($payload)), [
            'cancelled',
            'canceled',
        ], true);
    }

    public function isExpired(array $payload): bool
    {
        return strtolower((string) $this->status($payload)) === 'expired';
    }
}
