<?php

namespace App\Services\Pagamento\Providers\MercadoPago;

use App\Models\Pagamento\PaymentProviderAccount;
use RuntimeException;

class MercadoPagoAuthService
{
    public function accessToken(PaymentProviderAccount $account): string
    {
        if (! $account->client_secret) {
            throw new RuntimeException('Access token do Mercado Pago não configurado para esta conta.');
        }

        return $account->client_secret;
    }
}
