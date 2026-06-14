<?php

namespace App\Services\Admin\Reports;

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use Illuminate\Support\Carbon;

class ClientReportService
{
    public function handle(array $filters = []): array
    {
        return [
            'clients' => $this->clients(),

            'general' => $this->generalDashboard($filters),

            'client' => ! empty($filters['client_id'])
                ? $this->clientDashboard(
                    (int) $filters['client_id'],
                    $filters
                )
                : null,
        ];
    }

    private function clients()
    {
        return ClientProfile::query()
            ->orderBy('nome')
            ->orderBy('razao_social')
            ->get()
            ->map(fn ($client) => [
                'id' => $client->id,
                'name' => $client->display_name,
                'document' => $client->documento,
                'client_code' => $client->client_code,
            ])
            ->values()
            ->toArray();
    }

    private function baseQuery(array $filters = [])
    {
        return CustomerCharge::query()
            ->with([
                'clientProfile',
                'bill',
                'concessionaria',
                'usina',
            ])
            ->when(! empty($filters['client_id']), function ($query) use ($filters) {
                $query->where('client_profile_id', $filters['client_id']);
            })
            ->when(! empty($filters['start_date']), function ($query) use ($filters) {
                $query->whereDate(
                    'due_date',
                    '>=',
                    Carbon::parse($filters['start_date'])
                );
            })
            ->when(! empty($filters['end_date']), function ($query) use ($filters) {
                $query->whereDate(
                    'due_date',
                    '<=',
                    Carbon::parse($filters['end_date'])
                );
            });
    }

    private function generalDashboard(array $filters = []): array
    {
        $charges = $this->baseQuery($filters)->get();

        $originalAmount = $charges->sum('original_amount');
        $finalAmount = $charges->sum('final_amount');

        return [
            'summary' => [
                'clients_count' => $charges
                    ->pluck('client_profile_id')
                    ->unique()
                    ->count(),

                'charges_count' => $charges->count(),

                'original_amount' => round($originalAmount, 2),

                'final_amount' => round($finalAmount, 2),

                'economy_amount' => round(
                    max(0, $originalAmount - $finalAmount),
                    2
                ),

                'economy_percent' => $originalAmount > 0
                    ? round(
                        (
                            ($originalAmount - $finalAmount)
                            / $originalAmount
                        ) * 100,
                        2
                    )
                    : 0,

                'total_consumption_kwh' => round(
                    $charges->sum(fn ($charge) => (
                        float)($charge->bill?->consumo_kwh ?? 0)
                    ),
                    2
                ),

                'paid_amount' => round(
                    $charges
                        ->where('status', 'paid')
                        ->sum('final_amount'),
                    2
                ),

                'open_amount' => round(
                    $charges
                        ->whereIn('status', [
                            'draft',
                            'open',
                            'waiting_payment',
                            'overdue',
                        ])
                        ->sum('final_amount'),
                    2
                ),
            ],

            'economyEvolution' => $charges
                ->groupBy(fn ($charge) => (
                    str_pad(
                        $charge->reference_month,
                        2,
                        '0',
                        STR_PAD_LEFT
                    )
                    .'/'
                    .$charge->reference_year
                ))
                ->map(function ($monthCharges, $label) {
                    $original = $monthCharges->sum('original_amount');
                    $final = $monthCharges->sum('final_amount');

                    return [
                        'label' => $label,
                        'original_amount' => round($original, 2),
                        'final_amount' => round($final, 2),
                        'economy_amount' => round(
                            max(0, $original - $final),
                            2
                        ),
                    ];
                })
                ->values()
                ->toArray(),

            'topClients' => $charges
                ->groupBy('client_profile_id')
                ->map(function ($clientCharges) {
                    $client = $clientCharges->first()?->clientProfile;

                    $original = $clientCharges->sum('original_amount');
                    $final = $clientCharges->sum('final_amount');

                    return [
                        'client_name' => $client?->display_name,
                        'economy_amount' => round(
                            max(0, $original - $final),
                            2
                        ),
                        'final_amount' => round($final, 2),
                        'charges_count' => $clientCharges->count(),
                    ];
                })
                ->sortByDesc('economy_amount')
                ->take(10)
                ->values()
                ->toArray(),

            'chargesByStatus' => $charges
                ->groupBy('status')
                ->map(function ($statusCharges, $status) {
                    return [
                        'status' => $status ?: 'sem_status',
                        'total' => $statusCharges->count(),
                        'amount' => round(
                            $statusCharges->sum('final_amount'),
                            2
                        ),
                    ];
                })
                ->values()
                ->toArray(),
        ];
    }

    private function clientDashboard(
        int $clientId,
        array $filters = []
    ): array {
        $client = ClientProfile::query()
            ->with([
                'activeDiscountRule',
                'activeUsinaLink.usina',
            ])
            ->find($clientId);

        $charges = $this->baseQuery([
            ...$filters,
            'client_id' => $clientId,
        ])->get();

        $originalAmount = $charges->sum('original_amount');
        $finalAmount = $charges->sum('final_amount');

        return [
            'client' => [
                'id' => $client?->id,
                'name' => $client?->display_name,
                'document' => $client?->documento,
                'client_code' => $client?->client_code,
                'status' => $client?->status,
                'discount_percent' => (float) ($client?->activeDiscountRule?->discount_percent ?? 0),
                'usina' => (
                    $client?->activeUsinaLink?->usina?->nome
                    ?? $client?->activeUsinaLink?->usina?->uc
                ),
            ],

            'summary' => [
                'original_amount' => round($originalAmount, 2),

                'final_amount' => round($finalAmount, 2),

                'economy_amount' => round(
                    max(0, $originalAmount - $finalAmount),
                    2
                ),

                'economy_percent' => $originalAmount > 0
                    ? round(
                        (
                            ($originalAmount - $finalAmount)
                            / $originalAmount
                        ) * 100,
                        2
                    )
                    : 0,

                'consumption_kwh' => round(
                    $charges->sum(fn ($charge) => (float) ($charge->bill?->consumo_kwh ?? 0)
                    ),
                    2
                ),

                'charges_count' => $charges->count(),
            ],

            'economyEvolution' => $charges
                ->map(function ($charge) {
                    return [
                        'label' => (
                            str_pad(
                                $charge->reference_month,
                                2,
                                '0',
                                STR_PAD_LEFT
                            )
                            .'/'
                            .$charge->reference_year
                        ),

                        'original_amount' => (float) $charge->original_amount,

                        'final_amount' => (float) $charge->final_amount,

                        'economy_amount' => round(
                            max(
                                0,
                                $charge->original_amount
                                - $charge->final_amount
                            ),
                            2
                        ),

                        'discount_percent' => (float) $charge->discount_percent,

                        'consumo_kwh' => (float) ($charge->bill?->consumo_kwh ?? 0),
                    ];
                })
                ->values()
                ->toArray(),

            'latestCharges' => $charges
                ->sortByDesc('created_at')
                ->take(10)
                ->map(function ($charge) {
                    return [
                        'id' => $charge->id,

                        'reference_label' => (
                            str_pad(
                                $charge->reference_month,
                                2,
                                '0',
                                STR_PAD_LEFT
                            )
                            .'/'
                            .$charge->reference_year
                        ),

                        'original_amount' => (float) $charge->original_amount,

                        'discount_amount' => (float) $charge->discount_amount,

                        'final_amount' => (float) $charge->final_amount,

                        'status' => $charge->status,

                        'due_date' => optional(
                            $charge->due_date
                        )->format('d/m/Y'),
                    ];
                })
                ->values()
                ->toArray(),
        ];
    }
}
