<?php

namespace App\Services\Admin;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cliente\ClientProfile;
use Carbon\Carbon;

class BillingManagementService
{
    public function handle(array $filters = []): array
    {
        $year = (int) ($filters['year'] ?? now()->year);
        $month = (int) ($filters['month'] ?? now()->month);

        $charges = CustomerCharge::query()
            ->with(['clientProfile', 'usina.produtor', 'bill'])
            ->where('reference_year', $year)
            ->where('reference_month', $month)
            ->get();

        $overdueCharges = $charges->where('status', 'overdue');
        $openCharges = $charges->whereIn('status', ['open', 'waiting_payment']);
        $paidCharges = $charges->where('status', 'paid');

        return [
            'reference' => [
                'year' => $year,
                'month' => $month,
                'label' => str_pad((string) $month, 2, '0', STR_PAD_LEFT) . '/' . $year,
            ],

            'summary' => [
                'charges_count' => $charges->count(),
                'paid_count' => $paidCharges->count(),
                'open_count' => $openCharges->count(),
                'overdue_count' => $overdueCharges->count(),

                'total_amount' => (float) $charges->sum('final_amount'),
                'paid_amount' => (float) $paidCharges->sum('final_amount'),
                'open_amount' => (float) $openCharges->sum('final_amount'),
                'overdue_amount' => (float) $overdueCharges->sum('final_amount'),

                'default_rate_percentage' => $charges->count() > 0
                    ? round(($overdueCharges->count() / $charges->count()) * 100, 2)
                    : 0,
            ],

            'overdue_clients' => $this->overdueClients($overdueCharges),

            'high_risk_clients' => $this->highRiskClients(),

            'recent_paid' => $paidCharges
                ->sortByDesc('paid_at')
                ->take(10)
                ->values()
                ->map(fn ($charge) => $this->chargeItem($charge))
                ->toArray(),

            'open_charges' => $openCharges
                ->sortBy('due_date')
                ->take(20)
                ->values()
                ->map(fn ($charge) => $this->chargeItem($charge))
                ->toArray(),

            'overdue_charges' => $overdueCharges
                ->sortBy('due_date')
                ->values()
                ->map(fn ($charge) => $this->chargeItem($charge))
                ->toArray(),
        ];
    }

    private function overdueClients($overdueCharges): array
    {
        return $overdueCharges
            ->groupBy('client_profile_id')
            ->map(function ($charges) {
                $first = $charges->first();

                return [
                    'client_profile_id' => $first->client_profile_id,
                    'client_name' => $this->clientName($first->clientProfile),
                    'email' => $first->clientProfile?->email,
                    'charges_count' => $charges->count(),
                    'overdue_amount' => (float) $charges->sum('final_amount'),
                    'oldest_due_date' => optional($charges->sortBy('due_date')->first()->due_date)->format('d/m/Y'),
                ];
            })
            ->sortByDesc('overdue_amount')
            ->values()
            ->toArray();
    }

    private function highRiskClients(): array
    {
        return ClientProfile::query()
            ->withCount([
                'operationalAlerts as open_alerts_count' => function ($query) {
                    $query->whereIn('status', ['open', 'in_progress']);
                },
            ])
            ->whereHas('operationalAlerts', function ($query) {
                $query->whereIn('status', ['open', 'in_progress']);
            })
            ->orderByDesc('open_alerts_count')
            ->limit(10)
            ->get()
            ->map(fn ($client) => [
                'client_profile_id' => $client->id,
                'client_name' => $this->clientName($client),
                'email' => $client->email,
                'open_alerts_count' => $client->open_alerts_count,
            ])
            ->toArray();
    }

    private function chargeItem(CustomerCharge $charge): array
    {
        return [
            'id' => $charge->id,
            'client_profile_id' => $charge->client_profile_id,
            'client_name' => $this->clientName($charge->clientProfile),
            'usina_id' => $charge->usina_id,
            'usina_uc' => $charge->usina?->uc,
            'producer_name' => $charge->usina?->produtor?->name,
            'reference_label' => $charge->reference_label,
            'due_date' => optional($charge->due_date)->format('d/m/Y'),
            'final_amount' => (float) $charge->final_amount,
            'status' => $charge->status,
            'paid_at' => optional($charge->paid_at)->format('d/m/Y H:i'),
        ];
    }

    private function clientName(?ClientProfile $client): string
    {
        if (!$client) {
            return 'Cliente não informado';
        }

        if ($client->tipo_pessoa === 'pj') {
            return $client->razao_social
                ?: $client->nome_fantasia
                    ?: $client->email
                        ?: "Cliente #{$client->id}";
        }

        return $client->nome
            ?: $client->email
                ?: "Cliente #{$client->id}";
    }
}
