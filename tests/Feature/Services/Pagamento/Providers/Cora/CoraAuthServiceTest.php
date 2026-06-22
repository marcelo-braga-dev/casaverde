<?php

use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Pagamento\Providers\Cora\CoraAuthService;
use Illuminate\Support\Facades\Http;

describe('CoraAuthService', function () {

    beforeEach(function () {
        $this->service = app(CoraAuthService::class);
        $this->account = PaymentProviderAccount::factory()->create([
            'base_url' => 'https://cora.test',
        ]);
    });

    it('requests and returns the access token', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
        ]);

        $token = $this->service->accessToken($this->account);

        expect($token)->toBe('token-123');

        Http::assertSent(function ($request) {
            return $request->url() === 'https://cora.test/oauth/token'
                && $request['grant_type'] === 'client_credentials'
                && $request['client_id'] === $this->account->client_id;
        });
    });

    it('caches the token and does not request it again on a second call', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
        ]);

        $this->service->accessToken($this->account);
        $this->service->accessToken($this->account);

        Http::assertSentCount(1);
    });

    it('throws a RuntimeException when the HTTP call fails', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['error' => 'invalid_client'], 401),
        ]);

        expect(fn () => $this->service->accessToken($this->account))
            ->toThrow(RuntimeException::class, 'Falha ao autenticar na Cora');
    });

    it('throws a RuntimeException when the response has no access_token', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['foo' => 'bar'], 200),
        ]);

        expect(fn () => $this->service->accessToken($this->account))
            ->toThrow(RuntimeException::class, 'Token da Cora não retornado');
    });

});
