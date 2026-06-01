<?php

namespace App\Http\Controllers\Cliente\Relatorio;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use Inertia\Inertia;

class ClienteRelatorioIndexController extends Controller
{
    public function __invoke()
    {
        $profile = ClientProfile::query()
            ->where('platform_user_id', auth()->id())
            ->first();

        $totals = $profile
            ? CustomerCharge::query()
                ->where('client_profile_id', $profile->id)
                ->whereIn('status', ['paid', 'open', 'waiting_payment', 'overdue'])
                ->selectRaw('COUNT(*) as total, SUM(discount_amount) as total_savings, SUM(final_amount) as total_final')
                ->first()
            : null;

        $billCount = $profile
            ? ConcessionaireBill::query()
                ->where('client_profile_id', $profile->id)
                ->where('review_status', 'approved')
                ->count()
            : 0;

        return Inertia::render('Cliente/Relatorios/Index/Page', [
            'profile'    => $profile ? ['client_code' => $profile->client_code, 'display_name' => $profile->display_name] : null,
            'quickStats' => [
                'total_charges'  => (int) ($totals?->total ?? 0),
                'total_savings'  => (float) ($totals?->total_savings ?? 0),
                'total_final'    => (float) ($totals?->total_final ?? 0),
                'total_bills'    => $billCount,
            ],
        ]);
    }
}
