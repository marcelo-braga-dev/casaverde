<?php

namespace App\Services\Admin;

use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Usina\UsinaSolar;
use Carbon\Carbon;

class ExecutiveCockpitService
{
    public function handle(array $filters = []): array
    {
        $year = (int) ($filters['year'] ?? now()->year);
        $month = (int) ($filters['month'] ?? now()->month);

        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = (clone $startDate)->endOfMonth();

        return [
            'reference' => [
                'year' => $year,
                'month' => $month,
                'label' => str_pad((string) $month, 2, '0', STR_PAD_LEFT).'/'.$year,
            ],

            'financial' => $this->financialSummary($year, $month),

            'energy' => $this->energySummary(),

            'clients' => $this->clientsSummary(),

            'faturas' => $this->faturasSummary($year, $month),

            'alerts' => $this->alertsSummary(),

            'maintenance' => $this->maintenanceSummary(),

            'consultants' => $this->consultantsRanking($startDate, $endDate),

            'growth' => $this->growthIndicators($year, $month),

            'pending_actions' => $this->pendingActions($year, $month),
        ];
    }

    private function financialSummary(int $year, int $month): array
    {
        $bills = ConcessionaireBill::query()
            ->where('reference_year', $year)
            ->where('reference_month', $month);

        $totalValue = (float) $bills->sum('valor_total');

        $pendingReview = (clone $bills)
            ->where('review_status', 'pending_review')
            ->count();

        $approved = (clone $bills)
            ->where('review_status', 'approved')
            ->count();

        return [
            'total_billed' => $totalValue,
            'average_bill_value' => $approved > 0
                ? round($totalValue / $approved, 2)
                : 0,
            'pending_review_count' => $pendingReview,
            'approved_count' => $approved,
        ];
    }

    private function energySummary(): array
    {
        $usinas = UsinaSolar::query()->get();

        return [
            'total_available_kwh' => (float) $usinas->sum('energia_disponivel_kwh'),
            'total_allocated_kwh' => (float) $usinas->sum('energia_alocada_kwh'),
            'total_remaining_kwh' => (float) $usinas->sum('energia_saldo_kwh'),

            'critical_usinas_count' => $usinas
                ->filter(fn ($usina) => (float) $usina->energia_saldo_kwh <= 0)
                ->count(),

            'low_balance_usinas_count' => $usinas
                ->filter(function ($usina) {
                    $available = (float) $usina->energia_disponivel_kwh;

                    if ($available <= 0) {
                        return false;
                    }

                    $remainingPercentage = ((float) $usina->energia_saldo_kwh / $available) * 100;

                    return $remainingPercentage <= 10;
                })
                ->count(),
        ];
    }

    private function clientsSummary(): array
    {
        return [
            'clients_count' => ClientProfile::query()->count(),

            'clients_without_usina_count' => ClientProfile::query()
                ->whereDoesntHave('activeUsinaLink')
                ->count(),

            'active_links_count' => ClientUsinaLink::query()
                ->where('is_active', true)
                ->count(),
        ];
    }

    private function faturasSummary(int $year, int $month): array
    {
        return [
            'pending_review_count' => ConcessionaireBill::query()
                ->where('reference_year', $year)
                ->where('reference_month', $month)
                ->where('review_status', 'pending_review')
                ->count(),

            'approved_count' => ConcessionaireBill::query()
                ->where('reference_year', $year)
                ->where('reference_month', $month)
                ->where('review_status', 'approved')
                ->count(),

            'rejected_count' => ConcessionaireBill::query()
                ->where('reference_year', $year)
                ->where('reference_month', $month)
                ->where('review_status', 'rejected')
                ->count(),
        ];
    }

    private function alertsSummary(): array
    {
        return [
            'critical_alerts_count' => OperationalAlert::query()
                ->where('severity', 'critical')
                ->where('status', 'open')
                ->count(),

            'warning_alerts_count' => OperationalAlert::query()
                ->where('severity', 'warning')
                ->where('status', 'open')
                ->count(),

            'open_alerts_count' => OperationalAlert::query()
                ->where('status', 'open')
                ->count(),
        ];
    }

    private function maintenanceSummary(): array
    {
        return [];
    }

    private function consultantsRanking(Carbon $startDate, Carbon $endDate): array
    {
        return ClientProfile::query()
            ->selectRaw('consultor_user_id, COUNT(*) as total_clients')
            ->whereNotNull('consultor_user_id')
            ->groupBy('consultor_user_id')
            ->with('consultor:id,name')
            ->orderByDesc('total_clients')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'consultor_user_id' => $item->consultor_user_id,
                    'consultor_name' => $item->consultor?->name,
                    'total_clients' => (int) $item->total_clients,
                ];
            })
            ->toArray();
    }

    private function growthIndicators(int $year, int $month): array
    {
        return [
            'new_clients_count' => ClientProfile::query()
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count(),

            'new_usinas_count' => UsinaSolar::query()
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count(),

            'new_links_count' => ClientUsinaLink::query()
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count(),
        ];
    }

    private function pendingActions(int $year, int $month): array
    {
        $actions = [];

        $pendingReviewBills = ConcessionaireBill::query()
            ->where('reference_year', $year)
            ->where('reference_month', $month)
            ->where('review_status', 'pending_review')
            ->count();

        if ($pendingReviewBills > 0) {
            $actions[] = [
                'type' => 'faturas',
                'severity' => 'warning',
                'title' => 'Faturas pendentes de revisão',
                'description' => "Existem {$pendingReviewBills} faturas aguardando revisão.",
                'route' => route('admin.relatorios.faturas', [
                    'status' => 'pending_review',
                ]),
            ];
        }

        $criticalAlerts = OperationalAlert::query()
            ->where('severity', 'critical')
            ->where('status', 'open')
            ->count();

        if ($criticalAlerts > 0) {
            $actions[] = [
                'type' => 'alerts',
                'severity' => 'error',
                'title' => 'Alertas críticos abertos',
                'description' => "Existem {$criticalAlerts} alertas críticos em aberto.",
                'route' => route('admin.usinas.management'),
            ];
        }

        return $actions;
    }
}
