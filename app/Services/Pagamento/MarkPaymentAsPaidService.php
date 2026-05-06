<?php

namespace App\Services\Pagamento;

use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentTransaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MarkPaymentAsPaidService
{
    public function handle(PaymentSlip $slip, array $payload = []): void
    {
        DB::transaction(function () use ($slip, $payload) {
            $slip->loadMissing('charge');

            if ($slip->status === 'paid') {
                return;
            }

            $paidAt = $this->resolvePaidAt($payload);

            $paidAmount = $payload['paid_amount']
                ?? $payload['amount']
                ?? $slip->amount;

            $slip->update([
                'status' => 'paid',
                'provider_status' => $payload['provider_status'] ?? $payload['status'] ?? $slip->provider_status,
                'paid_at' => $paidAt,
                'response_payload' => array_merge($slip->response_payload ?? [], [
                    'payment_confirmation' => $payload,
                ]),
            ]);

            PaymentTransaction::firstOrCreate(
                [
                    'payment_slip_id' => $slip->id,
                    'provider_transaction_id' => $payload['transaction_id'] ?? $payload['id'] ?? $slip->provider_payment_id,
                ],
                [
                    'customer_charge_id' => $slip->customer_charge_id,
                    'provider' => $slip->provider,
                    'amount' => $paidAmount,
                    'paid_at' => $paidAt,
                    'status' => 'paid',
                    'raw_payload' => $payload,
                ]
            );

            $slip->charge?->update([
                'status' => 'paid',
                'paid_at' => $paidAt,
            ]);
        });
    }

    private function resolvePaidAt(array $payload): \Carbon\CarbonInterface
    {
        $paidAt = $payload['paid_at'] ?? $payload['paidAt'] ?? null;

        if (!$paidAt) {
            return now();
        }

        try {
            return Carbon::parse($paidAt);
        } catch (\Throwable) {
            return now();
        }
    }
}
