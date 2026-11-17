<?php

namespace App\Services\Admin\Dashboard;

use App\Enums\Cobranca\CustomerChargeStatus;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;

/**
 * Etapas do ciclo fatura → cobrança → pagamento que dependem de alguém agir, na ordem em
 * que o trabalho anda. Mostra onde o faturamento está parado sem precisar abrir relatório.
 */
class BillingQueueService
{
    public function handle(): array
    {
        $drafts = CustomerCharge::query()->where('status', 'draft');
        $withoutPayment = CustomerCharge::query()
            ->whereIn('status', CustomerChargeStatus::payableValues())
            ->whereDoesntHave('paymentSlips', fn ($q) => $q->whereIn('status', ['pending', 'generated', 'paid']));
        $overdue = CustomerCharge::query()->where('status', 'overdue');

        return [
            [
                'key' => 'bills_pending_review',
                'label' => 'Faturas para aprovar',
                'help' => 'Confira e aprove; a cobrança nasce em até 1 hora.',
                'count' => ConcessionaireBill::query()->where('review_status', 'pending_review')->count(),
                'amount' => null,
                'url' => route('admin.relatorios.faturas', ['review_status' => 'pending_review'], false),
            ],
            [
                'key' => 'charges_draft',
                'label' => 'Cobranças em rascunho',
                'help' => 'Abra para cobrar o cliente.',
                'count' => (clone $drafts)->count(),
                'amount' => (float) (clone $drafts)->sum('final_amount'),
                'url' => route('admin.financeiro.cobrancas.index', ['status' => 'draft'], false),
            ],
            [
                'key' => 'charges_without_payment',
                'label' => 'Cobranças sem boleto/Pix',
                'help' => 'Abertas ou vencidas sem pagamento ativo: gere e envie ao cliente.',
                'count' => (clone $withoutPayment)->count(),
                'amount' => (float) (clone $withoutPayment)->sum('final_amount'),
                'url' => route('admin.financeiro.cobrancas.index', ['status' => 'open'], false),
            ],
            [
                'key' => 'charges_overdue',
                'label' => 'Cobranças vencidas',
                'help' => 'Envie o lembrete ou um novo boleto.',
                'count' => (clone $overdue)->count(),
                'amount' => (float) (clone $overdue)->sum('final_amount'),
                'url' => route('admin.financeiro.cobrancas.index', ['status' => 'overdue'], false),
            ],
        ];
    }
}
