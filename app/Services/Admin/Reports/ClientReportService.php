<?php

namespace App\Services\Admin\Reports;

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Support\Reports\ReportDateRange;

class ClientReportService
{
    public function handle(array $filters = []): array
    {
        $range = ReportDateRange::fromFilters($filters);

        $clients = ClientProfile::query()
            ->with(['activeUsinaLink.usina', 'activeDiscountRule'])
            ->orderByDesc('id')
            ->get();

        $items = $clients->map(function (ClientProfile $client) use ($range) {
            $charges = CustomerCharge::query()
                ->where('client_profile_id', $client->id)
                ->whereBetween('created_at', [$range->startDate, $range->endDate]);

            return [
                'id' => $client->id,
                'client_code' => $client->client_code,
                'name' => $client->display_name
                    ?? $client->nome
                        ?? $client->razao_social
                        ?? 'Cliente #' . $client->id,
                'document' => $client->cpf ?: $client->cnpj,
                'status' => $client->status,
                'is_active_client' => (bool) $client->is_active_client,
                'usina' => $client->activeUsinaLink?->usina?->uc,
                'discount_percent' => (float) ($client->activeDiscountRule?->discount_percent ?? 0),
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
                'clients_count' => $items->count(),
                'active_clients_count' => $items->where('is_active_client', true)->count(),
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
