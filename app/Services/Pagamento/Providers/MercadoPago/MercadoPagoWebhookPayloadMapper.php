<?php

namespace App\Services\Pagamento\Providers\MercadoPago;

class MercadoPagoWebhookPayloadMapper
{
    public function eventId(array $payload): ?string
    {
        return isset($payload['id']) ? (string) $payload['id'] : $this->providerPaymentId($payload);
    }

    public function eventType(array $payload): ?string
    {
        return $payload['type'] ?? $payload['topic'] ?? null;
    }

    public function providerPaymentId(array $payload): ?string
    {
        if (isset($payload['data']['id'])) {
            return (string) $payload['data']['id'];
        }

        // Formato legado (IPN): {"topic":"payment","resource":"https://api.mercadopago.com/v1/payments/123"}
        if (isset($payload['resource'])) {
            $resource = (string) $payload['resource'];
            $path = parse_url($resource, PHP_URL_PATH);

            return basename($path ?: $resource);
        }

        return isset($payload['id']) ? (string) $payload['id'] : null;
    }
}
