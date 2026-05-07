<?php

namespace App\Services\Admin\Dashboard;

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Usina\UsinaSolar;

class AdminDashboardService
{
    public function handle(): array
    {
        return [
            'summary' => [
                'clients_total' => ClientProfile::query()->count(),

                'clients_active' => ClientProfile::query()
                    ->where(function ($query) {
                        $query->where('is_active_client', true)
                            ->orWhere('status', 'contrato_fechado');
                    })
                    ->count(),

                'plants_total' => UsinaSolar::query()->count(),

                'bills_pending_review' => ConcessionaireBill::query()
                    ->where('review_status', 'pending_review')
                    ->count(),

                'charges_open_amount' => (float) CustomerCharge::query()
                    ->whereIn('status', ['open', 'waiting_payment'])
                    ->sum('final_amount'),

                'charges_overdue_amount' => (float) CustomerCharge::query()
                    ->where('status', 'overdue')
                    ->sum('final_amount'),

                'charges_paid_amount_month' => (float) CustomerCharge::query()
                    ->where('status', 'paid')
                    ->whereMonth('paid_at', now()->month)
                    ->whereYear('paid_at', now()->year)
                    ->sum('final_amount'),

                'failed_payments' => PaymentSlip::query()
                    ->where('status', 'failed')
                    ->count(),
            ],

            'quickReports' => [
                [
                    'title' => 'Relatório Executivo',
                    'description' => 'Visão geral da operação, clientes, faturas, usinas e financeiro.',
                    'route' => 'admin.relatorios.executivo',
                ],
                [
                    'title' => 'Financeiro',
                    'description' => 'Cobranças, recebimentos, atrasos, descontos e evolução mensal.',
                    'route' => 'admin.relatorios.financeiro',
                ],
                [
                    'title' => 'Faturas',
                    'description' => 'Importações, revisões, aprovações e pendências operacionais.',
                    'route' => 'admin.relatorios.faturas',
                ],
                [
                    'title' => 'Clientes',
                    'description' => 'Carteira, status comercial e crescimento da base.',
                    'route' => 'admin.relatorios.clientes',
                ],
                [
                    'title' => 'Usinas',
                    'description' => 'Disponibilidade, cadastro, vínculos e visão energética.',
                    'route' => 'admin.relatorios.usinas',
                ],
                [
                    'title' => 'Pagamentos',
                    'description' => 'Pagamentos emitidos, confirmados, pendentes ou com falha.',
                    'route' => 'admin.relatorios.pagamentos',
                ],
            ],
        ];
    }
}
