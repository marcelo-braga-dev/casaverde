<?php

namespace App\Services\Pagamento;

use App\Contracts\Payments\PaymentProviderContract;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Pagamento\Providers\MercadoPago\MercadoPagoPaymentProvider;
use InvalidArgumentException;

class PaymentProviderManager
{
    public function make(string $provider, ?PaymentProviderAccount $account = null): PaymentProviderContract
    {
        $instance = match ($provider) {
            'mercado_pago' => app(MercadoPagoPaymentProvider::class),
            default => throw new InvalidArgumentException("Provider de pagamento não suportado: {$provider}"),
        };

        if ($account) {
            $instance->setAccount($account);
        }

        return $instance;
    }

    public function defaultAccount(string $provider): PaymentProviderAccount
    {
        return $this->defaultAccountQuery($provider)->firstOrFail();
    }

    private function defaultAccountQuery(string $provider)
    {
        return PaymentProviderAccount::query()
            ->where('provider', $provider)
            ->where('is_active', true)
            ->where('is_default', true);
    }
}
