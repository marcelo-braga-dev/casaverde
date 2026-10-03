<?php

namespace App\Services\Pagamento;

use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Pagamento\Providers\MercadoPago\MercadoPagoWebhookPayloadMapper;
use Throwable;

class ProcessPaymentWebhookService
{
    public function __construct(
        private readonly MercadoPagoWebhookPayloadMapper $mercadoPagoMapper,
        private readonly SyncPaymentSlipService $syncPaymentSlipService,
        private readonly PaymentAlertService $paymentAlerts,
    ) {}

    public function handle(PaymentWebhookEvent $event): PaymentWebhookEvent
    {
        if ($event->status === 'processed') {
            return $event;
        }

        $event->update([
            'attempts' => $event->attempts + 1,
            'last_attempt_at' => now(),
        ]);

        try {
            match ($event->provider) {
                // O webhook do Mercado Pago não traz o status do pagamento (só o id);
                // é preciso consultar a API para confirmar o estado atual, então a
                // chamada HTTP fica fora da transação de banco.
                'mercado_pago' => $this->processMercadoPago($event),
                default => $this->ignore($event, 'Provider de webhook não suportado.'),
            };

            $this->paymentAlerts->webhookOk($event);

            return $event->fresh();
        } catch (Throwable $e) {
            $event->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'processed_at' => now(),
            ]);

            $this->paymentAlerts->webhookFailed($event, $e);

            throw $e;
        }
    }

    private function processMercadoPago(PaymentWebhookEvent $event): void
    {
        $payload = $event->payload ?? [];

        $providerPaymentId = $event->provider_payment_id
            ?: $this->mercadoPagoMapper->providerPaymentId($payload);

        if (! $providerPaymentId) {
            $this->ignore($event, 'Webhook sem ID do pagamento no provider.');

            return;
        }

        $slip = PaymentSlip::query()
            ->where('provider', 'mercado_pago')
            ->where('provider_payment_id', $providerPaymentId)
            ->first();

        if (! $slip) {
            $this->ignore($event, 'Pagamento não encontrado no sistema.');

            return;
        }

        $event->update([
            'payment_slip_id' => $slip->id,
            'provider_payment_id' => $providerPaymentId,
        ]);

        $this->syncPaymentSlipService->handle($slip);

        $event->update([
            'status' => 'processed',
            'error_message' => null,
            'processed_at' => now(),
        ]);
    }

    private function ignore(PaymentWebhookEvent $event, string $message): void
    {
        $event->update([
            'status' => 'ignored',
            'error_message' => $message,
            'processed_at' => now(),
        ]);
    }
}
