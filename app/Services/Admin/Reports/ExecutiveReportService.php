<?php

namespace App\Services\Admin\Reports;

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientContract;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Proposta\CommercialProposal;
use App\Models\Usina\UsinaSolar;
use App\Support\Reports\ReportDateRange;

class ExecutiveReportService
{
    public function handle(array $filters = []): array
    {
        $range = ReportDateRange::fromFilters($filters);

        return [
            'range' => $range->toArray(),
            'summary' => $this->summary($range),
            'financialEvolution' => $this->financialEvolution($range),
            'clientsByStatus' => $this->clientsByStatus(),
            'proposalsByStatus' => $this->proposalsByStatus($range),
            'contractsByStatus' => $this->contractsByStatus($range),
            'billsByReviewStatus' => $this->billsByReviewStatus($range),
            'plantsByStatus' => $this->plantsByStatus(),
            'topClientsByCharges' => $this->topClientsByCharges($range),
        ];
    }

    private function summary(ReportDateRange $range): array
    {
        return [
            'clients_total' => ClientProfile::query()->count(),
            'clients_active' => ClientProfile::query()
                ->where(function ($query) {
                    $query->where('is_active_client', true)
                        ->orWhere('status', 'contrato_assinado');
                })
                ->count(),

            'proposals_total' => CommercialProposal::query()
                ->whereBetween('created_at', [$range->startDate, $range->endDate])
                ->count(),

            'contracts_total' => ClientContract::query()
                ->whereBetween('created_at', [$range->startDate, $range->endDate])
                ->count(),

            'bills_total' => ConcessionaireBill::query()
                ->whereBetween('created_at', [$range->startDate, $range->endDate])
                ->count(),

            'charges_total' => CustomerCharge::query()
                ->whereBetween('created_at', [$range->startDate, $range->endDate])
                ->count(),

            'charges_amount' => (float) CustomerCharge::query()
                ->whereBetween('created_at', [$range->startDate, $range->endDate])
                ->sum('final_amount'),

            'paid_amount' => (float) CustomerCharge::query()
                ->where('status', 'paid')
                ->whereBetween('paid_at', [$range->startDate, $range->endDate])
                ->sum('final_amount'),

            'overdue_amount' => (float) CustomerCharge::query()
                ->where('status', 'overdue')
                ->whereBetween('created_at', [$range->startDate, $range->endDate])
                ->sum('final_amount'),

            'plants_total' => UsinaSolar::query()->count(),
        ];
    }

    private function financialEvolution(ReportDateRange $range): array
    {
        return CustomerCharge::query()
            ->selectRaw("
                YEAR(created_at) as year,
                MONTH(created_at) as month,
                COUNT(*) as total,
                COALESCE(SUM(final_amount), 0) as amount,
                COALESCE(SUM(CASE WHEN status = 'paid' THEN final_amount ELSE 0 END), 0) as paid_amount,
                COALESCE(SUM(CASE WHEN status = 'overdue' THEN final_amount ELSE 0 END), 0) as overdue_amount
            ")
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()
            ->map(fn ($item) => [
                'label' => str_pad((string) $item->month, 2, '0', STR_PAD_LEFT) . '/' . $item->year,
                'amount' => (float) $item->amount,
                'paid_amount' => (float) $item->paid_amount,
                'overdue_amount' => (float) $item->overdue_amount,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }

    private function clientsByStatus(): array
    {
        return ClientProfile::query()
            ->selectRaw("COALESCE(status, 'sem_status') as status, COUNT(*) as total")
            ->groupByRaw("COALESCE(status, 'sem_status')")
            ->orderBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }

    private function proposalsByStatus(ReportDateRange $range): array
    {
        return CommercialProposal::query()
            ->selectRaw("COALESCE(status, 'sem_status') as status, COUNT(*) as total")
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->groupByRaw("COALESCE(status, 'sem_status')")
            ->orderBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }

    private function contractsByStatus(ReportDateRange $range): array
    {
        return ClientContract::query()
            ->selectRaw("COALESCE(status, 'sem_status') as status, COUNT(*) as total")
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->groupByRaw("COALESCE(status, 'sem_status')")
            ->orderBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }

    private function billsByReviewStatus(ReportDateRange $range): array
    {
        return ConcessionaireBill::query()
            ->selectRaw("COALESCE(review_status, 'sem_status') as status, COUNT(*) as total")
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->groupByRaw("COALESCE(review_status, 'sem_status')")
            ->orderBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }

    private function plantsByStatus(): array
    {
        return UsinaSolar::query()
            ->selectRaw("COALESCE(status, 'sem_status') as status, COUNT(*) as total")
            ->groupByRaw("COALESCE(status, 'sem_status')")
            ->orderBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }

    private function topClientsByCharges(ReportDateRange $range): array
    {
        return CustomerCharge::query()
            ->selectRaw('client_profile_id, COUNT(*) as total, COALESCE(SUM(final_amount), 0) as amount')
            ->with('clientProfile:id,nome,razao_social,nome_fantasia')
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->groupBy('client_profile_id')
            ->orderByDesc('amount')
            ->limit(10)
            ->get()
            ->map(fn ($item) => [
                'label' => $item->clientProfile?->nome
                    ?: $item->clientProfile?->razao_social
                        ?: $item->clientProfile?->nome_fantasia
                            ?: 'Cliente #' . $item->client_profile_id,
                'value' => (float) $item->amount,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }
}
