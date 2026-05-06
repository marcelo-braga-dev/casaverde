<?php

namespace App\Services\Pagamento;

use App\Models\Pagamento\PaymentSlip;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class SyncPaymentSlipService
{
    public function __construct(
        private readonly PaymentProviderManager $providerManager,
        private readonly MarkPaymentAsPaidService $markPaymentAsPaidService,
    ) {
    }

    public function handle(PaymentSlip $slip): PaymentSlip
    {
        if (!$slip->provider_payment_id) {
            throw new InvalidArgumentException('Pagamento sem ID no provider.');
        }

        if (!$slip->providerAccount) {
            throw new InvalidArgumentException('Pagamento sem conta de provider vinculada.');
        }

        $provider = $this->providerManager->make($slip->provider, $slip->providerAccount);
        $response = $provider->getPayment($slip->provider_payment_id);

        return DB::transaction(function () use ($slip, $response) {
            $slip->update([
                'provider_status' => $response->providerStatus,
                'status' => $response->status,
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

            if ($response->status === 'paid') {
                $this->markPaymentAsPaidService->handle($slip->fresh(), [
                    'provider_status' => $response->providerStatus,
                    'paid_amount' => $response->paidAmount,
                    'paid_at' => $response->paidAt,
                    'raw_payload' => $response->rawPayload,
                ]);
            }

            return $slip->fresh();
        });
    }
}
