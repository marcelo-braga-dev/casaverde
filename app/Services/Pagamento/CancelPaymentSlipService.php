<?php

namespace App\Services\Pagamento;

use App\Contracts\Payments\PaymentProviderContract;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use Throwable;

class CancelPaymentSlipService
{
    public function __construct(
        private readonly PaymentProviderManager $providerManager,
        private readonly MarkPaymentAsPaidService $markPaymentAsPaidService,
    ) {}

    public function handle(PaymentSlip $slip): PaymentSlip
    {
        if ($slip->status === 'paid') {
            throw new InvalidArgumentException('Não é possível cancelar um pagamento já pago.');
        }

        if (in_array($slip->status, ['cancelled', 'expired', 'refunded'], true)) {
            throw new InvalidArgumentException('Este pagamento já está cancelado ou expirado.');
        }

        if (! $slip->provider_payment_id) {
            throw new InvalidArgumentException('Pagamento sem ID no provider.');
        }

        if (! $slip->providerAccount) {
            throw new InvalidArgumentException('Pagamento sem conta de provider vinculada.');
        }

        $provider = $this->providerManager->make($slip->provider, $slip->providerAccount);

        $finalStatus = $provider->cancelPayment($slip->provider_payment_id)
            ? 'cancelled'
            : $this->statusWhenCancelRefused($slip, $provider);

        return DB::transaction(function () use ($slip, $finalStatus) {
            $slip->update([
                'status' => $finalStatus,
                'cancelled_at' => $finalStatus === 'cancelled' ? now() : $slip->cancelled_at,
            ]);

            if ($slip->charge && ! in_array($slip->charge->status, ['paid', 'cancelled'], true)) {
                $slip->charge->update([
                    'status' => 'open',
                ]);
            }

            return $slip->fresh();
        });
    }

    /**
     * Cancela no provider todo boleto/Pix ainda pagável da cobrança. Sem isso, cancelar
     * ou baixar a cobrança manualmente deixava o boleto vivo: o cliente ainda conseguia
     * pagar e, como o slip já não era sincronizado, o dinheiro entrava sem registro.
     */
    public function cancelActiveSlipsOf(CustomerCharge $charge): void
    {
        $activeSlips = $charge->paymentSlips()
            ->with('providerAccount')
            ->whereIn('status', ['pending', 'generated'])
            ->get();

        foreach ($activeSlips as $slip) {
            if (! $slip->provider_payment_id || ! $slip->providerAccount) {
                // Nunca chegou a existir no provider: não há o que cancelar lá.
                $slip->update(['status' => 'cancelled', 'cancelled_at' => now()]);

                continue;
            }

            $this->handle($slip);
        }
    }

    // O provider recusa cancelar um pedido que já mudou de estado do lado dele (pago,
    // expirado, cancelado). Consulta o estado real antes de tratar como erro.
    private function statusWhenCancelRefused(PaymentSlip $slip, PaymentProviderContract $provider): string
    {
        try {
            $response = $provider->getPayment($slip->provider_payment_id);
        } catch (Throwable) {
            throw new InvalidArgumentException('Não foi possível cancelar o pagamento no provider.');
        }

        if ($response->status === 'paid') {
            $this->markPaymentAsPaidService->handle($slip, [
                'provider_status' => $response->providerStatus,
                'paid_amount' => $response->paidAmount,
                'paid_at' => $response->paidAt,
                'raw_payload' => $response->rawPayload,
            ]);

            throw new InvalidArgumentException('O pagamento já havia sido confirmado no provider — a cobrança foi marcada como paga.');
        }

        if (in_array($response->status, ['cancelled', 'expired', 'failed'], true)) {
            return $response->status;
        }

        throw new InvalidArgumentException('Não foi possível cancelar o pagamento no provider.');
    }
}
