<?php

namespace App\Services\Admin\Reports;

use App\Models\Cobranca\CustomerCharge;
use App\Support\Reports\ReportDateRange;

class ChargeReportService
{
    public function handle(array $filters = []): array
    {
        $range = ReportDateRange::fromFilters($filters);

        $query = CustomerCharge::query()
            ->with(['clientProfile', 'usina', 'concessionaria'])
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->orderByDesc('id');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['reference_month'])) {
            $query->where('reference_month', $filters['reference_month']);
        }

        if (!empty($filters['reference_year'])) {
            $query->where('reference_year', $filters['reference_year']);
        }

        $charges = $query->get();

        return [
            'range' => $range->toArray(),
            'summary' => [
                'total' => $charges->count(),
                'original_amount' => (float) $charges->sum('original_amount'),
                'discount_amount' => (float) $charges->sum('discount_amount'),
                'manual_discount_amount' => (float) $charges->sum('manual_discount_amount'),
                'manual_addition_amount' => (float) $charges->sum('manual_addition_amount'),
                'final_amount' => (float) $charges->sum('final_amount'),
            ],
            'items' => $charges->map(fn (CustomerCharge $charge) => [
                'id' => $charge->id,
                'client_name' => $charge->clientProfile?->display_name
                    ?? $charge->clientProfile?->nome
                        ?? $charge->clientProfile?->razao_social
                        ?? 'Cliente #' . $charge->client_profile_id,
                'usina' => $charge->usina?->uc,
                'concessionaria' => $charge->concessionaria?->nome,
                'reference_label' => $charge->reference_label,
                'due_date' => optional($charge->due_date)->format('d/m/Y'),
                'status' => $charge->status,
                'original_amount' => (float) $charge->original_amount,
                'discount_percent' => (float) $charge->discount_percent,
                'discount_amount' => (float) $charge->discount_amount,
                'manual_discount_amount' => (float) $charge->manual_discount_amount,
                'manual_addition_amount' => (float) $charge->manual_addition_amount,
                'final_amount' => (float) $charge->final_amount,
                'paid_at' => optional($charge->paid_at)->format('d/m/Y H:i'),
            ])->values()->toArray(),
        ];
    }
}
