<?php

namespace App\Services\Usina;

use App\Models\Cliente\ClientUsinaLink;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Usina\UsinaGenerationRecord;
use App\Models\Usina\UsinaSolar;
use App\Services\Alert\ResolveOperationalAlertService;
use App\Services\Alert\UpsertOperationalAlertService;

class ScanUsinaOperationalAlertsService
{
    public function __construct(
        private readonly UpsertOperationalAlertService $upsertAlertService,
        private readonly ResolveOperationalAlertService $resolveAlertService
    ) {
    }

    public function handle(?int $year = null, ?int $month = null, ?int $usinaId = null): array
    {
        $year = $year ?: now()->year;
        $month = $month ?: now()->month;

        $usinas = UsinaSolar::query()
            ->with(['produtor', 'consultor'])
            ->when($usinaId, fn ($query) => $query->where('id', $usinaId))
            ->get();

        $createdOrUpdated = 0;

        foreach ($usinas as $usina) {
            $createdOrUpdated += $this->scanUsina($usina, $year, $month);
        }

        return [
            'reference_year' => $year,
            'reference_month' => $month,
            'usinas_scanned' => $usinas->count(),
            'alerts_created_or_updated' => $createdOrUpdated,
        ];
    }

    private function scanUsina(UsinaSolar $usina, int $year, int $month): int
    {
        $count = 0;

        $generation = UsinaGenerationRecord::query()
            ->where('usina_id', $usina->id)
            ->where('reference_year', $year)
            ->where('reference_month', $month)
            ->first();

        $activeLinks = ClientUsinaLink::query()
            ->where('usina_id', $usina->id)
            ->where('is_active', true)
            ->where('status', 'active')
            ->get();

        $bills = ConcessionaireBill::query()
            ->where('usina_id', $usina->id)
            ->where('reference_year', $year)
            ->where('reference_month', $month)
            ->get();

        $charges = CustomerCharge::query()
            ->where('usina_id', $usina->id)
            ->where('reference_year', $year)
            ->where('reference_month', $month)
            ->get();

        $availableEnergy = (float) ($generation?->available_energy_kwh ?? $usina->energia_disponivel_kwh ?? 0);
        $allocatedEnergy = (float) $activeLinks->sum('allocated_energy_kwh');
        $consumedEnergy = (float) $bills->sum('consumo_kwh');
        $remainingEnergy = $availableEnergy - $allocatedEnergy;

        if (!$generation) {
            $this->upsertAlertService->handle([
                'module' => 'usina',
                'type' => 'missing_generation_record',
                'severity' => 'warning',
                'title' => 'Usina sem geração mensal registrada',
                'message' => "A usina não possui registro de geração para {$month}/{$year}.",
                'usina_id' => $usina->id,
                'reference_year' => $year,
                'reference_month' => $month,
                'payload' => [
                    'uc' => $usina->uc,
                    'producer_name' => $usina->produtor?->name,
                ],
            ], $usina);

            $count++;
        } else {
            $this->resolveType($usina, 'missing_generation_record', $year, $month);
        }

        if ($availableEnergy <= 0) {
            $this->upsertAlertService->handle([
                'module' => 'usina',
                'type' => 'zero_available_energy',
                'severity' => 'error',
                'title' => 'Energia disponível zerada',
                'message' => "A usina está com energia disponível zerada para {$month}/{$year}.",
                'usina_id' => $usina->id,
                'reference_year' => $year,
                'reference_month' => $month,
                'payload' => [
                    'available_energy_kwh' => $availableEnergy,
                ],
            ], $usina);

            $count++;
        } else {
            $this->resolveType($usina, 'zero_available_energy', $year, $month);
        }

        if ($availableEnergy > 0 && $allocatedEnergy > $availableEnergy) {
            $this->upsertAlertService->handle([
                'module' => 'usina',
                'type' => 'allocated_energy_exceeds_available',
                'severity' => 'critical',
                'title' => 'Energia alocada excede energia disponível',
                'message' => 'A soma das alocações ativas é maior que a energia disponível da usina.',
                'usina_id' => $usina->id,
                'reference_year' => $year,
                'reference_month' => $month,
                'payload' => [
                    'available_energy_kwh' => $availableEnergy,
                    'allocated_energy_kwh' => $allocatedEnergy,
                ],
            ], $usina);

            $count++;
        } else {
            $this->resolveType($usina, 'allocated_energy_exceeds_available', $year, $month);
        }

        if ($availableEnergy > 0 && $remainingEnergy >= 0) {
            $remainingPercentage = ($remainingEnergy / $availableEnergy) * 100;

            if ($remainingPercentage <= 10) {
                $this->upsertAlertService->handle([
                    'module' => 'usina',
                    'type' => 'low_energy_balance',
                    'severity' => 'warning',
                    'title' => 'Saldo energético baixo',
                    'message' => "A usina possui apenas {$remainingPercentage}% de saldo disponível.",
                    'usina_id' => $usina->id,
                    'reference_year' => $year,
                    'reference_month' => $month,
                    'payload' => [
                        'available_energy_kwh' => $availableEnergy,
                        'allocated_energy_kwh' => $allocatedEnergy,
                        'remaining_energy_kwh' => $remainingEnergy,
                        'remaining_percentage' => round($remainingPercentage, 2),
                    ],
                ], $usina);

                $count++;
            } else {
                $this->resolveType($usina, 'low_energy_balance', $year, $month);
            }
        }

        if ($allocatedEnergy > 0 && $consumedEnergy > $allocatedEnergy) {
            $this->upsertAlertService->handle([
                'module' => 'usina',
                'type' => 'consumption_exceeds_allocated',
                'severity' => 'warning',
                'title' => 'Consumo faturado maior que energia alocada',
                'message' => 'O consumo total das faturas do mês ultrapassou a energia alocada aos clientes.',
                'usina_id' => $usina->id,
                'reference_year' => $year,
                'reference_month' => $month,
                'payload' => [
                    'allocated_energy_kwh' => $allocatedEnergy,
                    'consumed_energy_kwh' => $consumedEnergy,
                ],
            ], $usina);

            $count++;
        } else {
            $this->resolveType($usina, 'consumption_exceeds_allocated', $year, $month);
        }

        if ($bills->where('review_status', 'pending_review')->isNotEmpty()) {
            $this->upsertAlertService->handle([
                'module' => 'fatura',
                'type' => 'pending_bill_review',
                'severity' => 'warning',
                'title' => 'Faturas pendentes de revisão',
                'message' => 'Existem faturas pendentes de revisão para esta usina no período.',
                'usina_id' => $usina->id,
                'reference_year' => $year,
                'reference_month' => $month,
                'payload' => [
                    'pending_bills_count' => $bills->where('review_status', 'pending_review')->count(),
                ],
            ], $usina);

            $count++;
        } else {
            $this->resolveType($usina, 'pending_bill_review', $year, $month);
        }

        if ($charges->where('status', 'overdue')->isNotEmpty()) {
            $this->upsertAlertService->handle([
                'module' => 'financeiro',
                'type' => 'overdue_charges',
                'severity' => 'error',
                'title' => 'Cobranças vencidas',
                'message' => 'Existem cobranças vencidas vinculadas a esta usina no período.',
                'usina_id' => $usina->id,
                'reference_year' => $year,
                'reference_month' => $month,
                'payload' => [
                    'overdue_charges_count' => $charges->where('status', 'overdue')->count(),
                    'overdue_amount' => (float) $charges->where('status', 'overdue')->sum('final_amount'),
                ],
            ], $usina);

            $count++;
        } else {
            $this->resolveType($usina, 'overdue_charges', $year, $month);
        }

        $this->scanClientsWithoutBills($usina, $activeLinks, $bills, $year, $month);

        return $count;
    }

    private function scanClientsWithoutBills(
        UsinaSolar $usina,
                   $activeLinks,
                   $bills,
        int $year,
        int $month
    ): void {
        $clientIdsWithBills = $bills->pluck('client_profile_id')->filter()->unique();

        foreach ($activeLinks as $link) {
            if ($clientIdsWithBills->contains($link->client_profile_id)) {
                $this->resolveAlertService->resolveMatching([
                    'module' => 'fatura',
                    'type' => 'active_client_without_bill',
                    'usina_id' => $usina->id,
                    'client_profile_id' => $link->client_profile_id,
                    'reference_year' => $year,
                    'reference_month' => $month,
                ]);

                continue;
            }

            $this->upsertAlertService->handle([
                'module' => 'fatura',
                'type' => 'active_client_without_bill',
                'severity' => 'info',
                'title' => 'Cliente ativo sem fatura importada',
                'message' => 'Cliente possui vínculo ativo com a usina, mas não possui fatura importada no período.',
                'usina_id' => $usina->id,
                'client_profile_id' => $link->client_profile_id,
                'reference_year' => $year,
                'reference_month' => $month,
                'payload' => [
                    'client_usina_link_id' => $link->id,
                    'allocated_energy_kwh' => $link->allocated_energy_kwh,
                ],
            ], $link);
        }
    }

    private function resolveType(UsinaSolar $usina, string $type, int $year, int $month): void
    {
        $this->resolveAlertService->resolveMatching([
            'usina_id' => $usina->id,
            'type' => $type,
            'reference_year' => $year,
            'reference_month' => $month,
        ]);
    }
}
