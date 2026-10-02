<?php

namespace App\Services\Pagamento;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use App\Models\Pagamento\PaymentSlip;
use Closure;
use InvalidArgumentException;
use Throwable;

/**
 * Aplica uma mudança de valor/vencimento na cobrança mantendo o boleto coerente: o
 * boleto ativo carrega valor e vencimento fixos no código de barras, então precisa
 * ser cancelado no provider e reemitido com os dados novos.
 */
class ReissuePaymentSlipService
{
    public function __construct(
        private readonly CancelPaymentSlipService $cancelPaymentSlipService,
        private readonly GeneratePaymentSlipService $generatePaymentSlipService,
    ) {}

    public function applyChange(CustomerCharge $charge, Closure $change): ?PaymentSlip
    {
        $activeSlip = $charge->paymentSlips()
            ->with('providerAccount')
            ->whereIn('status', ['pending', 'generated'])
            ->latest('id')
            ->first();

        // Cancela antes de mudar a cobrança: se o provider recusar, nada é alterado.
        if ($activeSlip) {
            $this->cancelPaymentSlipService->cancelActiveSlipsOf($charge);
        }

        $change();

        if (! $activeSlip) {
            return null;
        }

        try {
            return $this->generatePaymentSlipService->handle(
                $charge->fresh(),
                $activeSlip->provider,
                $activeSlip->payment_method,
            );
        } catch (Throwable $e) {
            $reason = $e instanceof InvalidArgumentException ? $e->getMessage() : 'falha no provedor de pagamento.';

            CustomerChargeHistory::log(
                $charge->fresh(),
                'payment_reissue_failed',
                "Boleto anterior cancelado, mas a reemissão falhou: {$reason}"
            );

            throw new InvalidArgumentException("A cobrança foi atualizada e o boleto anterior cancelado, mas o novo não pôde ser emitido ({$reason}). Gere um novo pagamento manualmente.");
        }
    }
}
