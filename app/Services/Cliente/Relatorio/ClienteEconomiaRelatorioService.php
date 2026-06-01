<?php

namespace App\Services\Cliente\Relatorio;

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;

class ClienteEconomiaRelatorioService
{
    public function handle(int $platformUserId, array $filters = []): array
    {
        $profile = ClientProfile::query()
            ->with(['activeDiscountRule', 'activeUsinaLink.usina'])
            ->where('platform_user_id', $platformUserId)
            ->first();

        if (!$profile) {
            return $this->emptyReport();
        }

        $year  = (int) ($filters['year']  ?? now()->year);
        $month = isset($filters['month']) && $filters['month'] ? (int) $filters['month'] : null;

        $monthlyData = $this->getMonthlyData($profile->id, $year);
        $summary     = $this->buildSummary($monthlyData, $profile);
        $selected    = $month ? $this->getMonthDetail($profile->id, $year, $month) : null;
        $allTime     = $this->getAllTimeSummary($profile->id);

        return [
            'profile'     => $this->profilePayload($profile),
            'filters'     => ['year' => $year, 'month' => $month],
            'summary'     => $summary,
            'monthly'     => $monthlyData,
            'selected'    => $selected,
            'allTime'     => $allTime,
            'years'       => $this->getAvailableYears($profile->id),
        ];
    }

    // ─── Dados mensais ───────────────────────────────────────────────────

    private function getMonthlyData(int $clientProfileId, int $year): array
    {
        $charges = CustomerCharge::query()
            ->where('client_profile_id', $clientProfileId)
            ->whereIn('status', ['paid', 'open', 'waiting_payment', 'overdue'])
            ->where('reference_year', $year)
            ->orderBy('reference_month')
            ->get()
            ->keyBy('reference_month');

        $bills = ConcessionaireBill::query()
            ->where('client_profile_id', $clientProfileId)
            ->where('review_status', 'approved')
            ->where('reference_year', $year)
            ->orderBy('reference_month')
            ->get()
            ->keyBy('reference_month');

        $months = [];

        for ($m = 1; $m <= 12; $m++) {
            $charge = $charges->get($m);
            $bill   = $bills->get($m);

            $originalAmount = (float) ($charge?->original_amount ?? $bill?->valor_total ?? 0);
            $finalAmount    = (float) ($charge?->final_amount    ?? $originalAmount);
            $discountAmount = (float) ($charge?->discount_amount ?? 0);
            $discountPct    = (float) ($charge?->discount_percent ?? 0);
            $consumoKwh     = (float) ($bill?->consumo_kwh ?? 0);
            $netSavings     = $originalAmount - $finalAmount;

            $months[] = [
                'month'           => $m,
                'label'           => $this->monthLabel($m, $year),
                'month_name'      => $this->monthName($m),
                'has_data'        => $charge !== null || $bill !== null,
                'original_amount' => $originalAmount,
                'final_amount'    => $finalAmount,
                'discount_amount' => $discountAmount,
                'discount_percent'=> $discountPct,
                'consumo_kwh'     => $consumoKwh,
                'net_savings'     => max(0, $netSavings),
                'savings_percent' => $originalAmount > 0 ? round(($netSavings / $originalAmount) * 100, 1) : 0,
                'status'          => $charge?->status,
                'due_date'        => $charge?->due_date?->format('d/m/Y'),
                'paid_at'         => $charge?->paid_at?->format('d/m/Y'),
                'charge_id'       => $charge?->id,
                'bill_id'         => $bill?->id,
            ];
        }

        return $months;
    }

    private function getMonthDetail(int $clientProfileId, int $year, int $month): array
    {
        $charge = CustomerCharge::query()
            ->where('client_profile_id', $clientProfileId)
            ->where('reference_year', $year)
            ->where('reference_month', $month)
            ->whereIn('status', ['paid', 'open', 'waiting_payment', 'overdue', 'draft'])
            ->with(['bill.concessionaria'])
            ->first();

        $bill = ConcessionaireBill::query()
            ->where('client_profile_id', $clientProfileId)
            ->where('reference_year', $year)
            ->where('reference_month', $month)
            ->with('concessionaria')
            ->first();

        if (!$charge && !$bill) {
            return [];
        }

        $originalAmount = (float) ($charge?->original_amount ?? $bill?->valor_total ?? 0);
        $finalAmount    = (float) ($charge?->final_amount    ?? $originalAmount);
        $discountAmount = (float) ($charge?->discount_amount ?? 0);
        $discountPct    = (float) ($charge?->discount_percent ?? 0);
        $consumoKwh     = (float) ($bill?->consumo_kwh ?? 0);
        $netSavings     = max(0, $originalAmount - $finalAmount);

        return [
            'month'             => $month,
            'year'              => $year,
            'label'             => $this->monthLabel($month, $year),
            'concessionaria'    => $bill?->concessionaria?->nome ?? $charge?->bill?->concessionaria?->nome,
            'unidade_consumidora' => $bill?->unidade_consumidora,
            'consumo_kwh'       => $consumoKwh,
            'vencimento'        => $bill?->vencimento?->format('d/m/Y'),
            'original_amount'   => $originalAmount,
            'discount_percent'  => $discountPct,
            'discount_amount'   => $discountAmount,
            'manual_discount'   => (float) ($charge?->manual_discount_amount ?? 0),
            'manual_addition'   => (float) ($charge?->manual_addition_amount ?? 0),
            'final_amount'      => $finalAmount,
            'net_savings'       => $netSavings,
            'savings_percent'   => $originalAmount > 0 ? round(($netSavings / $originalAmount) * 100, 1) : 0,
            'status'            => $charge?->status,
            'due_date'          => $charge?->due_date?->format('d/m/Y'),
            'paid_at'           => $charge?->paid_at?->format('d/m/Y'),
            'pdf_url'           => $bill?->pdf_url,
            'charge_id'         => $charge?->id,
            'bill_id'           => $bill?->id,
        ];
    }

    // ─── Sumarização ──────────────────────────────────────────────────────

    private function buildSummary(array $monthlyData, ClientProfile $profile): array
    {
        $withData = array_filter($monthlyData, fn ($m) => $m['has_data']);

        $totalOriginal = array_sum(array_column($withData, 'original_amount'));
        $totalFinal    = array_sum(array_column($withData, 'final_amount'));
        $totalSavings  = array_sum(array_column($withData, 'net_savings'));
        $totalKwh      = array_sum(array_column($withData, 'consumo_kwh'));
        $avgDiscount   = (float) ($profile->activeDiscountRule?->discount_percent ?? 0);
        $monthsWithData = count($withData);

        $bestMonth = !empty($withData)
            ? collect($withData)->sortByDesc('net_savings')->first()
            : null;

        return [
            'total_original_amount' => $totalOriginal,
            'total_final_amount'    => $totalFinal,
            'total_savings'         => $totalSavings,
            'total_kwh'             => $totalKwh,
            'avg_discount_percent'  => $avgDiscount,
            'months_with_data'      => $monthsWithData,
            'avg_savings_month'     => $monthsWithData > 0 ? round($totalSavings / $monthsWithData, 2) : 0,
            'savings_percent_year'  => $totalOriginal > 0 ? round(($totalSavings / $totalOriginal) * 100, 1) : 0,
            'best_month'            => $bestMonth,
        ];
    }

    private function getAllTimeSummary(int $clientProfileId): array
    {
        $totals = CustomerCharge::query()
            ->where('client_profile_id', $clientProfileId)
            ->whereIn('status', ['paid', 'open', 'waiting_payment', 'overdue'])
            ->selectRaw('
                SUM(original_amount) as total_original,
                SUM(final_amount)    as total_final,
                SUM(discount_amount) as total_savings,
                COUNT(*)             as total_charges,
                MIN(CONCAT(reference_year, LPAD(reference_month, 2, "0"))) as first_period,
                MAX(CONCAT(reference_year, LPAD(reference_month, 2, "0"))) as last_period
            ')
            ->first();

        $paidTotals = CustomerCharge::query()
            ->where('client_profile_id', $clientProfileId)
            ->where('status', 'paid')
            ->selectRaw('SUM(final_amount) as total_paid, SUM(discount_amount) as total_saved_paid')
            ->first();

        $totalOriginal = (float) ($totals?->total_original ?? 0);
        $totalFinal    = (float) ($totals?->total_final ?? 0);
        $totalSavings  = (float) ($totals?->total_savings ?? 0);

        return [
            'total_original'         => $totalOriginal,
            'total_final'            => $totalFinal,
            'total_savings'          => $totalSavings,
            'total_paid'             => (float) ($paidTotals?->total_paid ?? 0),
            'total_saved_paid'       => (float) ($paidTotals?->total_saved_paid ?? 0),
            'total_charges'          => (int) ($totals?->total_charges ?? 0),
            'overall_savings_pct'    => $totalOriginal > 0 ? round(($totalSavings / $totalOriginal) * 100, 1) : 0,
        ];
    }

    // ─── Helpers ──────────────────────────────────────────────────────────

    private function getAvailableYears(int $clientProfileId): array
    {
        return CustomerCharge::query()
            ->where('client_profile_id', $clientProfileId)
            ->selectRaw('reference_year')
            ->groupBy('reference_year')
            ->orderByDesc('reference_year')
            ->pluck('reference_year')
            ->toArray();
    }

    private function profilePayload(ClientProfile $profile): array
    {
        $name = $profile->tipo_pessoa === 'pf'
            ? $profile->nome
            : ($profile->razao_social ?? $profile->nome_fantasia);

        return [
            'id'           => $profile->id,
            'client_code'  => $profile->client_code,
            'display_name' => $name ?? '—',
            'tipo_pessoa'  => $profile->tipo_pessoa,
            'status'       => $profile->status,
            'discount'     => (float) ($profile->activeDiscountRule?->discount_percent ?? 0),
            'usina_nome'   => $profile->activeUsinaLink?->usina?->usina_nome,
        ];
    }

    private function monthLabel(int $month, int $year): string
    {
        return sprintf('%02d/%d', $month, $year);
    }

    private function monthName(int $month): string
    {
        return ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][$month];
    }

    private function emptyReport(): array
    {
        return [
            'profile'  => null,
            'filters'  => [],
            'summary'  => [],
            'monthly'  => [],
            'selected' => null,
            'allTime'  => [],
            'years'    => [],
        ];
    }
}
