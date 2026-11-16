<?php

namespace App\Services\Admin\Reports;

use App\Models\Fatura\ConcessionaireBill;
use App\Services\Fatura\ApproveConcessionaireBillService;
use App\src\Roles\RoleUser;
use App\Support\Reports\ReportDateRange;

class BillReportService
{
    public function __construct(
        private readonly ApproveConcessionaireBillService $approveService,
    ) {}

    public function handle(array $filters = []): array
    {
        $range = ReportDateRange::fromFilters($filters);

        // A fila de revisão não tem período: fatura pendente de outro mês continua sendo trabalho a fazer.
        $wholeQueue = ($filters['review_status'] ?? null) === 'pending_review'
            && empty($filters['start_date']) && empty($filters['end_date']);

        $query = ConcessionaireBill::query()
            ->with(['clientProfile', 'usina', 'concessionaria', 'issues'])
            ->when(! $wholeQueue, fn ($q) => $q->whereBetween('created_at', [$range->startDate, $range->endDate]))
            ->orderByDesc('id');

        $user = auth()->user();

        if ($user && $user->role_id === RoleUser::$CONSULTOR) {
            $query->whereHas('clientProfile', function ($q) use ($user) {
                $q->where('consultor_user_id', $user->id);
            });
        }

        if (! empty($filters['review_status'])) {
            $query->where('review_status', $filters['review_status']);
        }

        if (! empty($filters['parser_status'])) {
            $query->where('parser_status', $filters['parser_status']);
        }

        if (! empty($filters['reference_month'])) {
            $query->where('reference_month', $filters['reference_month']);
        }

        if (! empty($filters['reference_year'])) {
            $query->where('reference_year', $filters['reference_year']);
        }

        if (! empty($filters['client_name'])) {
            $name = $filters['client_name'];

            $query->whereHas('clientProfile', function ($q) use ($name) {
                $q->where('nome', 'like', "%{$name}%")
                    ->orWhere('razao_social', 'like', "%{$name}%")
                    ->orWhere('nome_fantasia', 'like', "%{$name}%");
            });
        }

        $bills = $query->get();

        return [
            'range' => $wholeQueue ? ['start_date' => '', 'end_date' => '', 'label' => 'todas as datas'] : $range->toArray(),
            'summary' => [
                'total' => $bills->count(),
                'approved' => $bills->where('review_status', 'approved')->count(),
                'pending_review' => $bills->where('review_status', 'pending_review')->count(),
                'parser_error' => $bills->where('parser_status', 'error')->count(),
                'pending_queue_total' => $wholeQueue
                    ? $bills->count()
                    : ConcessionaireBill::query()
                        ->where('review_status', 'pending_review')
                        ->when($user && $user->role_id === RoleUser::$CONSULTOR, fn ($q) => $q->whereHas(
                            'clientProfile',
                            fn ($c) => $c->where('consultor_user_id', $user->id),
                        ))
                        ->count(),
                'whole_queue' => $wholeQueue,
                'total_amount' => (float) $bills->sum('valor_total'),
                'total_consumption_kwh' => (float) $bills->sum('consumo_kwh'),
            ],
            'items' => $bills->map(fn (ConcessionaireBill $bill) => [
                'id' => $bill->id,
                'client_name' => $bill->clientProfile?->display_name
                    ?? $bill->clientProfile?->nome
                        ?? $bill->clientProfile?->razao_social
                        ?? 'Cliente #'.$bill->client_profile_id,
                'usina' => $bill->usina?->uc,
                'concessionaria' => $bill->concessionaria?->nome,
                'unidade_consumidora' => $bill->unidade_consumidora,
                'reference_label' => $bill->reference_label,
                'vencimento' => optional($bill->vencimento)->format('d/m/Y'),
                'review_status' => $bill->review_status,
                'parser_status' => $bill->parser_status,
                'valor_total' => (float) $bill->valor_total,
                'consumo_kwh' => (float) $bill->consumo_kwh,
                'created_at' => optional($bill->created_at)->format('d/m/Y H:i'),
                'charge_estimate' => $this->chargeEstimate($bill),
                'approval_blockers' => $bill->review_status === 'pending_review'
                    ? $this->approveService->blockers($bill)
                    : [],
            ])->values()->toArray(),
        ];
    }

    // Mesma conta de GenerateCustomerChargeFromBillService: consumo injetado menos o desconto.
    private function chargeEstimate(ConcessionaireBill $bill): float
    {
        $base = abs((float) $bill->injected_consumption_amount);

        return round(max(0, $base - $base * ((float) $bill->injected_consumption_discount_percent / 100)), 2);
    }
}
