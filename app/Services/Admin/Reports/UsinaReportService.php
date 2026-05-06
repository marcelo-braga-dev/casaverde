<?php

namespace App\Services\Admin\Reports;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Usina\UsinaSolar;
use App\Support\Reports\ReportDateRange;

class UsinaReportService
{
    public function handle(array $filters = []): array
    {
        $range = ReportDateRange::fromFilters($filters);

        $usinas = UsinaSolar::query()
            ->with(['concessionaria', 'block'])
            ->orderByDesc('id')
            ->get();

        $items = $usinas->map(function (UsinaSolar $usina) use ($range) {
            $charges = CustomerCharge::query()
                ->where('usina_id', $usina->id)
                ->whereBetween('created_at', [$range->startDate, $range->endDate]);

            return [
                'id' => $usina->id,
                'uc' => $usina->uc,
                'status' => $usina->status,
                'concessionaria' => $usina->concessionaria?->nome,
                'block' => $usina->block?->nome,
                'media_geracao' => (float) ($usina->media_geracao ?? 0),
                'potencia_usina' => (float) ($usina->potencia_usina ?? 0),
                'charges_count' => (clone $charges)->count(),
                'paid_count' => (clone $charges)->where('status', 'paid')->count(),
                'open_count' => (clone $charges)->whereIn('status', ['open', 'waiting_payment'])->count(),
                'overdue_count' => (clone $charges)->where('status', 'overdue')->count(),
                'total_amount' => (float) (clone $charges)->sum('final_amount'),
                'paid_amount' => (float) (clone $charges)->where('status', 'paid')->sum('final_amount'),
                'open_amount' => (float) (clone $charges)->whereIn('status', ['open', 'waiting_payment'])->sum('final_amount'),
                'overdue_amount' => (float) (clone $charges)->where('status', 'overdue')->sum('final_amount'),
            ];
        });

        return [
            'range' => $range->toArray(),
            'summary' => [
                'usinas_count' => $items->count(),
                'charges_count' => $items->sum('charges_count'),
                'total_amount' => (float) $items->sum('total_amount'),
                'paid_amount' => (float) $items->sum('paid_amount'),
                'open_amount' => (float) $items->sum('open_amount'),
                'overdue_amount' => (float) $items->sum('overdue_amount'),
            ],
            'items' => $items->values()->toArray(),
        ];
    }
}
