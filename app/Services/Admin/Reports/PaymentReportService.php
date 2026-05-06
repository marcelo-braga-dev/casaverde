<?php

namespace App\Services\Admin\Reports;

use App\Models\Pagamento\PaymentSlip;
use App\Support\Reports\ReportDateRange;

class PaymentReportService
{
    public function handle(array $filters = []): array
    {
        $range = ReportDateRange::fromFilters($filters);

        $query = PaymentSlip::query()
            ->with(['charge.clientProfile', 'providerAccount'])
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->orderByDesc('id');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['provider'])) {
            $query->where('provider', $filters['provider']);
        }

        $payments = $query->get();

        return [
            'range' => $range->toArray(),
            'summary' => [
                'total' => $payments->count(),
                'amount' => (float) $payments->sum('amount'),
                'paid_total' => $payments->where('status', 'paid')->count(),
                'paid_amount' => (float) $payments->where('status', 'paid')->sum('amount'),
                'failed_total' => $payments->where('status', 'failed')->count(),
                'cancelled_total' => $payments->where('status', 'cancelled')->count(),
            ],
            'items' => $payments->map(fn (PaymentSlip $payment) => [
                'id' => $payment->id,
                'charge_id' => $payment->customer_charge_id,
                'client_name' => $payment->charge?->clientProfile?->display_name
                    ?? $payment->charge?->clientProfile?->nome
                        ?? $payment->charge?->clientProfile?->razao_social
                        ?? '-',
                'provider' => $payment->provider,
                'provider_payment_id' => $payment->provider_payment_id,
                'payment_method' => $payment->payment_method,
                'status' => $payment->status,
                'amount' => (float) $payment->amount,
                'due_date' => optional($payment->due_date)->format('d/m/Y'),
                'generated_at' => optional($payment->generated_at)->format('d/m/Y H:i'),
                'paid_at' => optional($payment->paid_at)->format('d/m/Y H:i'),
            ])->values()->toArray(),
        ];
    }
}
