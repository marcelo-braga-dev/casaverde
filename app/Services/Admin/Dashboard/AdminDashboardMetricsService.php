<?php

namespace App\Services\Admin\Dashboard;

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Usina\UsinaSolar;
use Carbon\CarbonInterface;

class AdminDashboardMetricsService
{
    public function handle(): array
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        return [
            'summary' => $this->summary($startOfMonth, $endOfMonth),
            'chargesByStatus' => $this->chargesByStatus(),
            'billsByStatus' => $this->billsByStatus(),
            'paymentsByStatus' => $this->paymentsByStatus(),
            'monthlyRevenue' => $this->monthlyRevenue(),
            'latestCharges' => $this->latestCharges(),
            'latestPayments' => $this->latestPayments(),
            'pendingBills' => $this->pendingBills(),
            'failedWebhooks' => $this->failedWebhooks(),
        ];
    }

    private function summary(CarbonInterface $startOfMonth, CarbonInterface $endOfMonth): array
    {
        return [
            'active_clients' => ClientProfile::query()
                ->where('is_active_client', true)
                ->count(),

            'prospect_clients' => ClientProfile::query()
                ->where(function ($query) {
                    $query->where('is_active_client', false)
                        ->orWhereNull('is_active_client');
                })
                ->count(),

            'producers' => ProducerProfile::query()->count(),

            'usinas' => UsinaSolar::query()->count(),

            'proposals' => CommercialProposal::query()->count(),

            'pending_bills' => ConcessionaireBill::query()
                ->where('review_status', 'pending_review')
                ->count(),

            'approved_bills_month' => ConcessionaireBill::query()
                ->where('review_status', 'approved')
                ->whereBetween('updated_at', [$startOfMonth, $endOfMonth])
                ->count(),

            'open_charges' => CustomerCharge::query()
                ->whereIn('status', ['open', 'waiting_payment'])
                ->count(),

            'overdue_charges' => CustomerCharge::query()
                ->where('status', 'overdue')
                ->count(),

            'paid_charges_month' => CustomerCharge::query()
                ->where('status', 'paid')
                ->whereBetween('paid_at', [$startOfMonth, $endOfMonth])
                ->count(),

            'amount_receivable' => (float) CustomerCharge::query()
                ->whereIn('status', ['open', 'waiting_payment'])
                ->sum('final_amount'),

            'amount_overdue' => (float) CustomerCharge::query()
                ->where('status', 'overdue')
                ->sum('final_amount'),

            'amount_received_month' => (float) CustomerCharge::query()
                ->where('status', 'paid')
                ->whereBetween('paid_at', [$startOfMonth, $endOfMonth])
                ->sum('final_amount'),

            'failed_payments' => PaymentSlip::query()
                ->where('status', 'failed')
                ->count(),

            'failed_webhooks' => PaymentWebhookEvent::query()
                ->where('status', 'failed')
                ->count(),
        ];
    }

    private function chargesByStatus(): array
    {
        return CustomerCharge::query()
            ->selectRaw('status, COUNT(*) as total, COALESCE(SUM(final_amount), 0) as amount')
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

    private function billsByStatus(): array
    {
        return ConcessionaireBill::query()
            ->selectRaw('review_status as status, COUNT(*) as total')
            ->groupBy('review_status')
            ->orderBy('review_status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }

    private function paymentsByStatus(): array
    {
        return PaymentSlip::query()
            ->selectRaw('status, COUNT(*) as total, COALESCE(SUM(amount), 0) as amount')
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

    private function monthlyRevenue(): array
    {
        return CustomerCharge::query()
            ->selectRaw('YEAR(paid_at) as year, MONTH(paid_at) as month, COALESCE(SUM(final_amount), 0) as amount, COUNT(*) as total')
            ->where('status', 'paid')
            ->whereNotNull('paid_at')
            ->where('paid_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupByRaw('YEAR(paid_at), MONTH(paid_at)')
            ->orderByRaw('YEAR(paid_at), MONTH(paid_at)')
            ->get()
            ->map(fn ($item) => [
                'label' => str_pad((string) $item->month, 2, '0', STR_PAD_LEFT).'/'.$item->year,
                'amount' => (float) $item->amount,
                'total' => (int) $item->total,
            ])
            ->values()
            ->toArray();
    }

    private function latestCharges(): array
    {
        return CustomerCharge::query()
            ->with(['clientProfile', 'usina'])
            ->orderByDesc('id')
            ->limit(8)
            ->get()
            ->map(fn (CustomerCharge $charge) => [
                'id' => $charge->id,
                'client_name' => $charge->clientProfile?->display_name
                    ?? $charge->clientProfile?->nome
                        ?? $charge->clientProfile?->razao_social
                        ?? 'Cliente #'.$charge->client_profile_id,
                'reference_label' => $charge->reference_label,
                'status' => $charge->status,
                'final_amount' => (float) $charge->final_amount,
                'due_date' => optional($charge->due_date)->format('d/m/Y'),
            ])
            ->toArray();
    }

    private function latestPayments(): array
    {
        return PaymentSlip::query()
            ->with(['charge.clientProfile'])
            ->orderByDesc('id')
            ->limit(8)
            ->get()
            ->map(fn (PaymentSlip $payment) => [
                'id' => $payment->id,
                'provider' => $payment->provider,
                'status' => $payment->status,
                'amount' => (float) $payment->amount,
                'client_name' => $payment->charge?->clientProfile?->display_name
                    ?? $payment->charge?->clientProfile?->nome
                        ?? $payment->charge?->clientProfile?->razao_social
                        ?? '-',
                'generated_at' => optional($payment->generated_at)->format('d/m/Y H:i'),
            ])
            ->toArray();
    }

    private function pendingBills(): array
    {
        return ConcessionaireBill::query()
            ->with(['clientProfile'])
            ->where('review_status', 'pending_review')
            ->orderByDesc('id')
            ->limit(8)
            ->get()
            ->map(fn (ConcessionaireBill $bill) => [
                'id' => $bill->id,
                'client_name' => $bill->clientProfile?->display_name
                    ?? $bill->clientProfile?->nome
                        ?? $bill->clientProfile?->razao_social
                        ?? 'Cliente #'.$bill->client_profile_id,
                'reference_label' => $bill->reference_label,
                'valor_total' => (float) $bill->valor_total,
                'created_at' => optional($bill->created_at)->format('d/m/Y H:i'),
            ])
            ->toArray();
    }

    private function failedWebhooks(): array
    {
        return PaymentWebhookEvent::query()
            ->where('status', 'failed')
            ->orderByDesc('id')
            ->limit(8)
            ->get()
            ->map(fn (PaymentWebhookEvent $event) => [
                'id' => $event->id,
                'provider' => $event->provider,
                'event_type' => $event->event_type,
                'provider_payment_id' => $event->provider_payment_id,
                'error_message' => $event->error_message,
                'created_at' => optional($event->created_at)->format('d/m/Y H:i'),
            ])
            ->toArray();
    }
}
