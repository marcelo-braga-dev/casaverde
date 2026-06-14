<?php

namespace App\Http\Controllers\Cliente\Fatura;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use Inertia\Inertia;

class ClienteFaturaController extends Controller
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
        $filters = request()->only(['search', 'status', 'year']);

        $query = ConcessionaireBill::query()
            ->with(['concessionaria'])
            ->where('client_profile_id', $profile?->id ?? 0)
            ->orderByDesc('reference_year')
            ->orderByDesc('reference_month');

        if (! empty($filters['status'])) {
            $query->where('review_status', $filters['status']);
        }

        if (! empty($filters['year'])) {
            $query->where('reference_year', $filters['year']);
        }

        if (! empty($filters['search'])) {
            $query->where('reference_label', 'like', '%'.$filters['search'].'%');
        }

        return Inertia::render('Cliente/Faturas/Index/Page', [
            'faturas' => $query->paginate(12)->withQueryString(),
            'filters' => $filters,
            'profile' => $profile,
        ]);
    }

    public function show(ConcessionaireBill $fatura)
    {
        $profile = $this->getProfile();

        abort_if(
            $fatura->client_profile_id !== $profile?->id,
            403,
            'Acesso não autorizado a esta fatura.'
        );

        $fatura->load(['concessionaria', 'issues']);

        $charge = $fatura->charges()->with('paymentSlips')->first();

        return Inertia::render('Cliente/Faturas/Show/Page', [
            'fatura' => $fatura,
            'profile' => $profile,
            'charge' => $charge,
        ]);
    }
}
