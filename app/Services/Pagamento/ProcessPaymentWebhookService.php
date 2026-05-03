<?php

namespace App\Services\Pagamento;

use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Pagamento\Providers\Cora\CoraWebhookPayloadMapper;
use Illuminate\Support\Facades\DB;
use Throwable;

class ProcessPaymentWebhookService
{
    public function __construct(
        private readonly CoraWebhookPayloadMapper $coraMapper,
        private readonly MarkPaymentAsPaidService $markPaymentAsPaidService,
    ) {
    }

    public function handle(PaymentWebhookEvent $event): PaymentWebhookEvent
    {
        if ($event->status === 'processed') {
            return $event;
        }

        return DB::transaction(function () use ($event) {
            $event->update([
                'attempts' => $event->attempts + 1,
                'last_attempt_at' => now(),
            ]);

            try {
                match ($event->provider) {
                    'cora' => $this->processCora($event),
                    default => $this->ignore($event, 'Provider de webhook não suportado.'),
                };

                return $event->fresh();
            } catch (Throwable $e) {
                $event->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                    'processed_at' => now(),
                ]);

                throw $e;
            }
        });
    }

    private function processCora(PaymentWebhookEvent $event): void
    {
        $payload = $event->payload ?? [];

        $providerPaymentId = $event->provider_payment_id
            ?: $this->coraMapper->providerPaymentId($payload);

        if (!$providerPaymentId) {
            $this->ignore($event, 'Webhook sem ID do pagamento no provider.');
            return;
        }

        $slip = PaymentSlip::query()
            ->where('provider', 'cora')
            ->where('provider_payment_id', $providerPaymentId)
            ->first();

        if (!$slip) {
            $this->ignore($event, 'Pagamento não encontrado no sistema.');
            return;
        }

        $event->update([
            'payment_slip_id' => $slip->id,
            'provider_payment_id' => $providerPaymentId,
        ]);

        if ($this->coraMapper->isPaid($payload)) {
            $this->markPaymentAsPaidService->handle($slip, [
                'provider_status' => $this->coraMapper->status($payload),
                'transaction_id' => $this->coraMapper->transactionId($payload),
                'paid_amount' => $this->coraMapper->paidAmount($payload) ?? $slip->amount,
                'paid_at' => $this->coraMapper->paidAt($payload),
                'raw_payload' => $payload,
            ]);

            $event->update([
                'status' => 'processed',
                'error_message' => null,
                'processed_at' => now(),
            ]);

            return;
        }

        if ($this->coraMapper->isCancelled($payload)) {
            $slip->update([
                'status' => 'cancelled',
                'provider_status' => $this->coraMapper->status($payload),
                'cancelled_at' => now(),
                'response_payload' => array_merge($slip->response_payload ?? [], [
                    'webhook_cancelled' => $payload,
                ]),
            ]);

            $event->update([
                'status' => 'processed',
                'error_message' => null,
                'processed_at' => now(),
            ]);

            return;
        }

        if ($this->coraMapper->isExpired($payload)) {
            $slip->update([
                'status' => 'expired',
                'provider_status' => $this->coraMapper->status($payload),
                'response_payload' => array_merge($slip->response_payload ?? [], [
                    'webhook_expired' => $payload,
                ]),
            ]);

            $event->update([
                'status' => 'processed',
                'error_message' => null,
                'processed_at' => now(),
            ]);

            return;
        }

        $this->ignore($event, 'Status não exige ação operacional.');
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
