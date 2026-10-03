<?php

namespace App\Jobs;

use App\Exceptions\Payments\PaymentProviderException;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\PaymentAlertService;
use App\Services\Pagamento\SyncPaymentSlipService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Log;

class SyncPaymentStatusJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $paymentId,
    ) {}

    public function handle(SyncPaymentSlipService $service, ?PaymentAlertService $alerts = null): void
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

        if (! in_array($payment->status, ['pending', 'generated', 'expired'], true)) {
            return;
        }

        $alerts ??= app(PaymentAlertService::class);

        try {
            $service->handle($payment);
            $alerts->syncOk($payment);
        } catch (PaymentProviderException $e) {
            // Rate limit (429) e instabilidade (5xx) do provider são transitórios e o
            // casaverde:sync-payments roda a cada 5 min — a próxima rodada já tenta de novo.
            // Instabilidade prolongada é pega pela varredura de saúde (sync atrasado).
            if (! $this->isTransient($e->httpStatus)) {
                $alerts->syncFailed($payment, $e);

                throw $e;
            }

            Log::warning("[SyncPaymentStatus] Falha transitória ao sincronizar pagamento #{$payment->id} (HTTP {$e->httpStatus}); nova tentativa na próxima rodada.");
        } catch (ConnectionException) {
            Log::warning("[SyncPaymentStatus] Provider sem resposta ao sincronizar pagamento #{$payment->id}; nova tentativa na próxima rodada.");
        }
    }

    private function isTransient(?int $httpStatus): bool
    {
        return $httpStatus === 429 || ($httpStatus !== null && $httpStatus >= 500);
    }
}
