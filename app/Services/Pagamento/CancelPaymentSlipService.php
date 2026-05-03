<?php

namespace App\Services\Pagamento;

use App\Models\Pagamento\PaymentSlip;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CancelPaymentSlipService
{
    public function __construct(
        private readonly PaymentProviderManager $providerManager,
    ) {
    }

    public function handle(PaymentSlip $slip): PaymentSlip
    {
        if ($slip->status === 'paid') {
            throw new InvalidArgumentException('Não é possível cancelar um pagamento já pago.');
        }

        if (in_array($slip->status, ['cancelled', 'expired'], true)) {
            throw new InvalidArgumentException('Este pagamento já está cancelado ou expirado.');
        }

        if (!$slip->provider_payment_id) {
            throw new InvalidArgumentException('Pagamento sem ID no provider.');
        }

        if (!$slip->providerAccount) {
            throw new InvalidArgumentException('Pagamento sem conta de provider vinculada.');
        }

        $provider = $this->providerManager->make($slip->provider, $slip->providerAccount);

        $cancelled = $provider->cancelPayment($slip->provider_payment_id);

        if (!$cancelled) {
            throw new InvalidArgumentException('Não foi possível cancelar o pagamento no provider.');
        }

        return DB::transaction(function () use ($slip) {
            $slip->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            if ($slip->charge && !in_array($slip->charge->status, ['paid', 'cancelled'], true)) {
                $slip->charge->update([
                    'status' => 'open',
                ]);
            }

            return $slip->fresh();
        });
    }
}
