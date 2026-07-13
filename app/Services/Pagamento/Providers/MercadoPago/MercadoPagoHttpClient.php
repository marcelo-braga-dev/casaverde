<?php

namespace App\Services\Pagamento\Providers\MercadoPago;

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class MercadoPagoHttpClient
{
    public function client(PaymentProviderAccount $account, string $accessToken): PendingRequest
    {
        return Http::baseUrl($account->base_url ?: 'https://api.mercadopago.com')
            ->withToken($accessToken)
            ->acceptJson()
            ->asJson()
            ->timeout(30);
    }
}
