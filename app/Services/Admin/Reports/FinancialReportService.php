<?php

namespace App\Services\Admin\Reports;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Support\Reports\ReportDateRange;

class FinancialReportService
{
    public function handle(array $filters = []): array
    {
        $range = ReportDateRange::fromFilters($filters);

        return [
            'range' => $range->toArray(),
            'summary' => $this->summary($range),
            'chargesByStatus' => $this->chargesByStatus($range),
            'paymentsByStatus' => $this->paymentsByStatus($range),
            'monthlyEvolution' => $this->monthlyEvolution($range),
        ];
    }

    private function summary(ReportDateRange $range): array
    {
        $charges = CustomerCharge::query()
            ->whereBetween('created_at', [$range->startDate, $range->endDate]);

        $paidCharges = CustomerCharge::query()
            ->where('status', 'paid')
            ->whereBetween('paid_at', [$range->startDate, $range->endDate]);

        $openCharges = CustomerCharge::query()
            ->whereIn('status', ['open', 'waiting_payment'])
            ->whereBetween('created_at', [$range->startDate, $range->endDate]);

        $overdueCharges = CustomerCharge::query()
            ->where('status', 'overdue')
            ->whereBetween('created_at', [$range->startDate, $range->endDate]);

        $cancelledCharges = CustomerCharge::query()
            ->where('status', 'cancelled')
            ->whereBetween('created_at', [$range->startDate, $range->endDate]);

        return [
            'charges_count' => (clone $charges)->count(),
            'gross_amount' => (float) (clone $charges)->sum('original_amount'),
            'contract_discount_amount' => (float) (clone $charges)->sum('discount_amount'),
            'manual_discount_amount' => (float) (clone $charges)->sum('manual_discount_amount'),
            'manual_addition_amount' => (float) (clone $charges)->sum('manual_addition_amount'),
            'final_amount' => (float) (clone $charges)->sum('final_amount'),

            'paid_count' => (clone $paidCharges)->count(),
            'paid_amount' => (float) (clone $paidCharges)->sum('final_amount'),

            'open_count' => (clone $openCharges)->count(),
            'open_amount' => (float) (clone $openCharges)->sum('final_amount'),

            'overdue_count' => (clone $overdueCharges)->count(),
            'overdue_amount' => (float) (clone $overdueCharges)->sum('final_amount'),

            'cancelled_count' => (clone $cancelledCharges)->count(),
            'cancelled_amount' => (float) (clone $cancelledCharges)->sum('final_amount'),

            'failed_payments' => PaymentSlip::query()
                ->where('status', 'failed')
                ->whereBetween('created_at', [$range->startDate, $range->endDate])
                ->count(),
        ];
    }

    private function chargesByStatus(ReportDateRange $range): array
    {
        return CustomerCharge::query()
            ->selectRaw('status, COUNT(*) as total, COALESCE(SUM(final_amount), 0) as amount')
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => (int) $item->total,
                'amount' => (float) $item->amount,
            ])
            ->values()
            ->toArray();
    }

    private function paymentsByStatus(ReportDateRange $range): array
    {
        return PaymentSlip::query()
            ->selectRaw('status, COUNT(*) as total, COALESCE(SUM(amount), 0) as amount')
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => (int) $item->total,
                'amount' => (float) $item->amount,
            ])
            ->values()
            ->toArray();
    }

    private function monthlyEvolution(ReportDateRange $range): array
    {
        $charges = CustomerCharge::query()
            ->selectRaw("
            YEAR(created_at) as year,
            MONTH(created_at) as month,
            COUNT(*) as total,
            COALESCE(SUM(final_amount), 0) as amount,
            COALESCE(SUM(CASE WHEN status = 'paid' THEN final_amount ELSE 0 END), 0) as paid_amount,
            COALESCE(SUM(CASE WHEN status IN ('open', 'waiting_payment') THEN final_amount ELSE 0 END), 0) as open_amount,
            COALESCE(SUM(CASE WHEN status = 'overdue' THEN final_amount ELSE 0 END), 0) as overdue_amount,
            COALESCE(SUM(CASE WHEN status = 'cancelled' THEN final_amount ELSE 0 END), 0) as cancelled_amount
        ")
            ->whereBetween('created_at', [$range->startDate, $range->endDate])
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at), MONTH(created_at)')
            ->get();

        return $charges
            ->map(fn ($item) => [
                'label' => str_pad((string) $item->month, 2, '0', STR_PAD_LEFT) . '/' . $item->year,
                'year' => (int) $item->year,
                'month' => (int) $item->month,
                'total' => (int) $item->total,
                'amount' => (float) $item->amount,
                'paid_amount' => (float) $item->paid_amount,
                'open_amount' => (float) $item->open_amount,
                'overdue_amount' => (float) $item->overdue_amount,
                'cancelled_amount' => (float) $item->cancelled_amount,
            ])
            ->values()
            ->toArray();
    }
}
