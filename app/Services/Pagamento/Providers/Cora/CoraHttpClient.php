<?php

namespace App\Services\Pagamento\Providers\Cora;

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class CoraHttpClient
{
    public function client(PaymentProviderAccount $account, string $accessToken): PendingRequest
    {
        return Http::baseUrl($account->base_url)
            ->withToken($accessToken)
            ->acceptJson()
            ->asJson()
            ->timeout(30);
    }
}
