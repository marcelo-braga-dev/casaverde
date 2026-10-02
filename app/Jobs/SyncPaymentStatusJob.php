<?php

namespace App\Jobs;

use App\Exceptions\Payments\PaymentProviderException;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\SyncPaymentSlipService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncPaymentStatusJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $paymentId,
    ) {}

    public function handle(SyncPaymentSlipService $service): void
    {
        $payment = PaymentSlip::query()
            ->with('providerAccount')
            ->find($this->paymentId);

        if (! $payment) {
            return;
        }

        if (! $payment->providerAccount) {
            return;
        }

        if (! in_array($payment->status, ['pending', 'generated'], true)) {
            return;
        }

        try {
            $service->handle($payment);
        } catch (PaymentProviderException $e) {
            // Rate limit (429) e instabilidade (5xx) do provider são transitórios e o
            // casaverde:sync-payments roda a cada 5 min — a próxima rodada já tenta de novo.
            if (! $this->isTransient($e->httpStatus)) {
                throw $e;
            }

            Log::warning("[SyncPaymentStatus] Falha transitória ao sincronizar pagamento #{$payment->id} (HTTP {$e->httpStatus}); nova tentativa na próxima rodada.");
        }
    }

    private function isTransient(?int $httpStatus): bool
    {
        return $httpStatus === 429 || ($httpStatus !== null && $httpStatus >= 500);
    }
}
