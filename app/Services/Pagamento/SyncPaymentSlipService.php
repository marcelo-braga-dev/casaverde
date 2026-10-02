<?php

namespace App\Services\Pagamento;

use App\Models\Cobranca\CustomerChargeHistory;
use App\Models\Pagamento\PaymentSlip;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

class SyncPaymentSlipService
{
    public function __construct(
        private readonly PaymentProviderManager $providerManager,
        private readonly MarkPaymentAsPaidService $markPaymentAsPaidService,
        private readonly CancelPaymentSlipService $cancelPaymentSlipService,
    ) {}

    public function handle(PaymentSlip $slip): PaymentSlip
    {
        if (! $slip->provider_payment_id) {
            throw new InvalidArgumentException('Pagamento sem ID no provider.');
        }

        if (! $slip->providerAccount) {
            throw new InvalidArgumentException('Pagamento sem conta de provider vinculada.');
        }

        $provider = $this->providerManager->make($slip->provider, $slip->providerAccount);
        $response = $provider->getPayment($slip->provider_payment_id);

        $synced = DB::transaction(function () use ($slip, $response) {
            // Guarda o status anterior antes de qualquer update: MarkPaymentAsPaidService
            // usa "status === paid" como trava de idempotência, então não podemos gravar
            // 'paid' no slip antes de chamá-lo, senão a trava dispara e ele nunca roda.
            $wasAlreadyPaid = $slip->status === 'paid';

            $slip->update([
                'provider_status' => $response->providerStatus,
                'barcode' => $response->barcode ?? $slip->barcode,
                'digitable_line' => $response->digitableLine ?? $slip->digitable_line,
                'pix_qr_code' => $response->pixQrCode ?? $slip->pix_qr_code,
                'pix_copy_paste' => $response->pixCopyPaste ?? $slip->pix_copy_paste,
                'checkout_url' => $response->checkoutUrl ?? $slip->checkout_url,
                'pdf_url' => $response->pdfUrl ?? $slip->pdf_url,
                'response_payload' => array_merge($slip->response_payload ?? [], [
                    'sync' => $response->rawPayload,
                    'synced_at' => now()->toDateTimeString(),
                ]),
            ]);

            if ($response->status === 'paid' && ! $wasAlreadyPaid) {
                $this->markPaymentAsPaidService->handle($slip->fresh(), [
                    'provider_status' => $response->providerStatus,
                    'paid_amount' => $response->paidAmount,
                    'paid_at' => $response->paidAt,
                    'raw_payload' => $response->rawPayload,
                ]);
            } elseif ($slip->status === 'expired') {
                // Vencido aqui, mas o provider ainda não fechou o pedido (o MP só expira
                // 30 dias depois): só um pagamento muda esse estado.
            } elseif ($wasAlreadyPaid) {
                // Um slip pago nunca volta a "generated": qualquer status desconhecido do
                // provider caía no default do mapper e reabria o boleto já pago.
                $this->handleChangeOnPaidSlip($slip, $response->status);
            } else {
                $slip->update(['status' => $response->status]);
                $this->reopenChargeIfPaymentDied($slip, $response->status);
            }

            return $slip->fresh();
        });

        if ($synced->status === 'paid' && $response->status === 'paid') {
            $this->cancelReplacementSlips($synced);
        }

        return $synced;
    }

    // Boleto vencido que compensou depois (pago no último dia) enquanto um substituto já
    // tinha sido emitido: o substituto precisa morrer para o cliente não pagar duas vezes.
    private function cancelReplacementSlips(PaymentSlip $paidSlip): void
    {
        $paidSlip->charge?->paymentSlips()
            ->with('providerAccount')
            ->whereKeyNot($paidSlip->id)
            ->whereIn('status', ['pending', 'generated'])
            ->get()
            ->each(function (PaymentSlip $replacement) use ($paidSlip) {
                try {
                    $this->cancelPaymentSlipService->handle($replacement);

                    CustomerChargeHistory::log(
                        $paidSlip->charge->fresh(),
                        'payment_replacement_cancelled',
                        "Boleto/Pix #{$replacement->id} cancelado: o pagamento #{$paidSlip->id} foi confirmado antes."
                    );
                } catch (Throwable $e) {
                    Log::error("[SyncPaymentSlip] Cobrança #{$paidSlip->customer_charge_id} paga pelo slip #{$paidSlip->id}, mas o slip #{$replacement->id} não pôde ser cancelado: {$e->getMessage()}");
                }
            });
    }

    // Estorno não reabre a cobrança sozinho: o dinheiro pode ter sido devolvido por
    // acordo (ex.: pagamento em duplicidade), então fica registrado para revisão humana.
    private function handleChangeOnPaidSlip(PaymentSlip $slip, string $newStatus): void
    {
        if ($newStatus !== 'refunded') {
            return;
        }

        $slip->update(['status' => 'refunded']);

        if ($slip->charge) {
            CustomerChargeHistory::log(
                $slip->charge,
                'payment_refunded',
                "Pagamento #{$slip->id} estornado no {$slip->provider}. A cobrança continua como paga — revise e reabra se necessário."
            );
        }
    }

    // Sem isso, uma cobrança que virou "overdue" enquanto o slip ainda estava
    // pending/generated fica travada para sempre assim que o slip morre: nem
    // GeneratePaymentSlipService nem a automação aceitam gerar pagamento para
    // charge fora de open/waiting_payment, e nada além do cancelamento manual
    // (CancelPaymentSlipService) reabre a charge. Mesmo padrão usado lá.
    private function reopenChargeIfPaymentDied(PaymentSlip $slip, string $newStatus): void
    {
        if (! in_array($newStatus, ['cancelled', 'expired', 'failed', 'refunded'], true)) {
            return;
        }

        if ($slip->charge && ! in_array($slip->charge->status, ['paid', 'cancelled'], true)) {
            $slip->charge->update(['status' => 'open']);
        }
    }
}
