<?php

use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Pagamento\Providers\MercadoPago\MercadoPagoAuthService;

describe('MercadoPagoAuthService', function () {

    beforeEach(function () {
        $this->service = app(MercadoPagoAuthService::class);
    });

    it('returns the access token configured for the account', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->create([
            'client_secret' => 'APP_USR-token-123',
        ]);

        expect($this->service->accessToken($account))->toBe('APP_USR-token-123');
    });

    it('throws a RuntimeException when the account has no access token', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->create([
            'client_secret' => null,
        ]);

        expect(fn () => $this->service->accessToken($account))
            ->toThrow(RuntimeException::class, 'Access token do Mercado Pago não configurado');
    });

});
