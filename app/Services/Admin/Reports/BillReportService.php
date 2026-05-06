<?php

namespace App\Services\Admin\Reports;

use App\Models\Fatura\ConcessionaireBill;
use App\Support\Reports\ReportDateRange;

class BillReportService
{
    public function handle(array $filters = []): array
    {
        $range = ReportDateRange::fromFilters($filters);

        $query = ConcessionaireBill::query()
            ->with(['clientProfile', 'usina', 'concessionaria'])
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->orderByDesc('id');

        if (!empty($filters['review_status'])) {
            $query->where('review_status', $filters['review_status']);
        }

        if (!empty($filters['parser_status'])) {
            $query->where('parser_status', $filters['parser_status']);
        }

        if (!empty($filters['reference_month'])) {
            $query->where('reference_month', $filters['reference_month']);
        }

        if (!empty($filters['reference_year'])) {
            $query->where('reference_year', $filters['reference_year']);
        }

        $bills = $query->get();

        return [
            'range' => $range->toArray(),
            'summary' => [
                'total' => $bills->count(),
                'approved' => $bills->where('review_status', 'approved')->count(),
                'pending_review' => $bills->where('review_status', 'pending_review')->count(),
                'parser_error' => $bills->where('parser_status', 'error')->count(),
                'total_amount' => (float) $bills->sum('valor_total'),
                'total_consumption_kwh' => (float) $bills->sum('consumo_kwh'),
            ],
            'items' => $bills->map(fn (ConcessionaireBill $bill) => [
                'id' => $bill->id,
                'client_name' => $bill->clientProfile?->display_name
                    ?? $bill->clientProfile?->nome
                        ?? $bill->clientProfile?->razao_social
                        ?? 'Cliente #' . $bill->client_profile_id,
                'usina' => $bill->usina?->uc,
                'concessionaria' => $bill->concessionaria?->nome,
                'unidade_consumidora' => $bill->unidade_consumidora,
                'reference_label' => $bill->reference_label,
                'vencimento' => optional($bill->vencimento)->format('d/m/Y'),
                'review_status' => $bill->review_status,
                'parser_status' => $bill->parser_status,
                'valor_total' => (float) $bill->valor_total,
                'consumo_kwh' => (float) $bill->consumo_kwh,
                'created_at' => optional($bill->created_at)->format('d/m/Y H:i'),
            ])->values()->toArray(),
        ];
    }
}
