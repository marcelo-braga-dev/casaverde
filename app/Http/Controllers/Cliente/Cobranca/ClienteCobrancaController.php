<?php

namespace App\Http\Controllers\Cliente\Cobranca;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use Inertia\Inertia;

class ClienteCobrancaController extends Controller
{
    private function getProfile(): ?ClientProfile
    {
        return ClientProfile::query()
            ->where('platform_user_id', auth()->id())
            ->first();
    }

    public function index()
    {
        $profile = $this->getProfile();

        $filters = request()->only(['status', 'year']);

        $query = CustomerCharge::query()
            ->where('client_profile_id', $profile?->id ?? 0)
            ->orderByDesc('created_at');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['year'])) {
            $query->where('reference_year', $filters['year']);
        }

        return Inertia::render('Cliente/Cobrancas/Index/Page', [
            'cobrancas' => $query->paginate(12)->withQueryString(),
            'filters' => $filters,
            'profile' => $profile,
            'totais' => $this->getTotais($profile?->id ?? 0),
        ]);
    }

    public function show(CustomerCharge $cobranca)
    {
        $profile = $this->getProfile();

        abort_if(
            $cobranca->client_profile_id !== $profile?->id,
            403,
            'Acesso não autorizado a esta cobrança.'
        );

        $cobranca->load(['bill.concessionaria', 'paymentSlips', 'adjustments']);

        return Inertia::render('Cliente/Cobrancas/Show/Page', [
            'cobranca' => $cobranca,
            'profile' => $profile,
        ]);
    }

    private function getTotais(int $clientProfileId): array
    {
        return [
            'pendente' => (float) CustomerCharge::query()
                ->where('client_profile_id', $clientProfileId)
                ->whereIn('status', ['open', 'waiting_payment'])
                ->sum('final_amount'),
            'vencido' => (float) CustomerCharge::query()
                ->where('client_profile_id', $clientProfileId)
                ->where('status', 'overdue')
                ->sum('final_amount'),
            'pago_ano' => (float) CustomerCharge::query()
                ->where('client_profile_id', $clientProfileId)
                ->where('status', 'paid')
                ->whereYear('paid_at', now()->year)
                ->sum('final_amount'),
        ];
    }
}
