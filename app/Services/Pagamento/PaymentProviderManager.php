<?php

namespace App\Services\Pagamento;

use App\Contracts\Payments\PaymentProviderContract;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Pagamento\Providers\Cora\CoraPaymentProvider;
use InvalidArgumentException;

class PaymentProviderManager
{
    public function make(string $provider, ?PaymentProviderAccount $account = null): PaymentProviderContract
    {
        $instance = match ($provider) {
            'cora' => app(CoraPaymentProvider::class),
            default => throw new InvalidArgumentException("Provider de pagamento não suportado: {$provider}"),
        };

        if ($account) {
            $instance->setAccount($account);
        }

        return $instance;
    }

    public function defaultAccount(string $provider): PaymentProviderAccount
    {
        return PaymentProviderAccount::query()
            ->where('provider', $provider)
            ->where('is_active', true)
            ->where('is_default', true)
            ->firstOrFail();
    }
}
