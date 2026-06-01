<?php

namespace App\Services\Cliente\Dashboard;

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;

class ClienteDashboardService
{
    public function handle(int $platformUserId): array
    {
        $profile = ClientProfile::query()
            ->with([
                'contacts',
                'activeDiscountRule',
                'contracts' => fn ($q) => $q->latest()->limit(1),
            ])
            ->where('platform_user_id', $platformUserId)
            ->first();

        if (!$profile) {
            return $this->emptyData();
        }

        return [
            'profile'       => $profile,
            'summary'       => $this->getSummary($profile),
            'recentBills'   => $this->getRecentBills($profile->id),
            'recentCharges' => $this->getRecentCharges($profile->id),
            'energyChart'   => $this->getEnergyChart($profile->id),
        ];
    }

    private function getSummary(ClientProfile $profile): array
    {
        $billsTotal = ConcessionaireBill::query()
            ->where('client_profile_id', $profile->id)
            ->where('review_status', 'approved')
            ->count();

        $consumptionMonth = (float) ConcessionaireBill::query()
            ->where('client_profile_id', $profile->id)
            ->where('review_status', 'approved')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('consumo_kwh');

        $chargesPending = CustomerCharge::query()
            ->where('client_profile_id', $profile->id)
            ->whereIn('status', ['open', 'waiting_payment'])
            ->count();

        $chargesPendingAmount = (float) CustomerCharge::query()
            ->where('client_profile_id', $profile->id)
            ->whereIn('status', ['open', 'waiting_payment'])
            ->sum('final_amount');

        $chargesOverdue = CustomerCharge::query()
            ->where('client_profile_id', $profile->id)
            ->where('status', 'overdue')
            ->count();

        $chargesOverdueAmount = (float) CustomerCharge::query()
            ->where('client_profile_id', $profile->id)
            ->where('status', 'overdue')
            ->sum('final_amount');

        $chargesPaidYear = (float) CustomerCharge::query()
            ->where('client_profile_id', $profile->id)
            ->where('status', 'paid')
            ->whereYear('paid_at', now()->year)
            ->sum('final_amount');

        $totalSaved = (float) CustomerCharge::query()
            ->where('client_profile_id', $profile->id)
            ->where('status', 'paid')
            ->sum('discount_amount');

        $discountPercent = (float) ($profile->activeDiscountRule?->discount_percent ?? 0);

        return [
            'bills_total'             => $billsTotal,
            'consumption_kwh_month'   => $consumptionMonth,
            'charges_pending'         => $chargesPending,
            'charges_pending_amount'  => $chargesPendingAmount,
            'charges_overdue'         => $chargesOverdue,
            'charges_overdue_amount'  => $chargesOverdueAmount,
            'charges_paid_year'       => $chargesPaidYear,
            'total_saved'             => $totalSaved,
            'active_discount_percent' => $discountPercent,
        ];
    }

    private function getRecentBills(int $clientProfileId): array
    {
        return ConcessionaireBill::query()
            ->where('client_profile_id', $clientProfileId)
            ->with(['concessionaria'])
            ->orderByDesc('reference_year')
            ->orderByDesc('reference_month')
            ->limit(6)
            ->get([
                'id', 'client_profile_id', 'concessionaria_id',
                'reference_month', 'reference_year', 'reference_label',
                'valor_total', 'consumo_kwh', 'review_status',
                'vencimento', 'pdf_url', 'created_at',
            ])
            ->toArray();
    }

    private function getRecentCharges(int $clientProfileId): array
    {
        return CustomerCharge::query()
            ->where('client_profile_id', $clientProfileId)
            ->orderByDesc('created_at')
            ->limit(6)
            ->get([
                'id', 'client_profile_id', 'reference_label',
                'reference_month', 'reference_year',
                'original_amount', 'discount_amount', 'final_amount',
                'status', 'due_date', 'paid_at',
            ])
            ->toArray();
    }

    private function getEnergyChart(int $clientProfileId): array
    {
        $bills = ConcessionaireBill::query()
            ->where('client_profile_id', $clientProfileId)
            ->where('review_status', 'approved')
            ->orderByDesc('reference_year')
            ->orderByDesc('reference_month')
            ->limit(12)
            ->get(['reference_month', 'reference_year', 'reference_label', 'consumo_kwh', 'valor_total'])
            ->reverse()
            ->values();

        return $bills->map(fn ($b) => [
            'label'       => $b->reference_label ?? "{$b->reference_month}/{$b->reference_year}",
            'consumo_kwh' => (float) $b->consumo_kwh,
            'valor_total' => (float) $b->valor_total,
        ])->toArray();
    }

    private function emptyData(): array
    {
        return [
            'profile'       => null,
            'summary'       => [
                'bills_total'             => 0,
                'consumption_kwh_month'   => 0,
                'charges_pending'         => 0,
                'charges_pending_amount'  => 0,
                'charges_overdue'         => 0,
                'charges_overdue_amount'  => 0,
                'charges_paid_year'       => 0,
                'total_saved'             => 0,
                'active_discount_percent' => 0,
            ],
            'recentBills'   => [],
            'recentCharges' => [],
            'energyChart'   => [],
        ];
    }
}
