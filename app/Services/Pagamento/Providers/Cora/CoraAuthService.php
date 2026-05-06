<?php

namespace App\Services\Pagamento\Providers\Cora;

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class CoraAuthService
{
    public function accessToken(PaymentProviderAccount $account): string
    {
        return Cache::remember(
            $this->cacheKey($account),
            now()->addMinutes(45),
            fn () => $this->requestToken($account)
        );
    }

    private function requestToken(PaymentProviderAccount $account): string
    {
        $response = Http::baseUrl($account->base_url)
            ->asForm()
            ->post('/oauth/token', [
                'grant_type' => 'client_credentials',
                'client_id' => $account->client_id,
                'client_secret' => $account->client_secret,
            ]);

        if (!$response->successful()) {
            throw new RuntimeException('Falha ao autenticar na Cora: ' . $response->body());
        }

        $token = $response->json('access_token');

        if (!$token) {
            throw new RuntimeException('Token da Cora não retornado.');
        }

        return $token;
    }

    private function cacheKey(PaymentProviderAccount $account): string
    {
        return 'payment_provider:cora:token:' . $account->id;
    }
}
