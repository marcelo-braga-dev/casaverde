<?php

namespace App\Http\Controllers\Cliente\Contrato;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientContract;
use App\Models\Cliente\ClientProfile;
use Inertia\Inertia;

class ClienteContratoController extends Controller
{
    public function index()
    {
        $profile = ClientProfile::query()
            ->where('platform_user_id', auth()->id())
            ->first();

        $contratos = ClientContract::query()
            ->where('client_profile_id', $profile?->id ?? 0)
            ->with(['proposal'])
            ->latest()
            ->get();

        return Inertia::render('Cliente/Contrato/Index/Page', [
            'contratos' => $contratos,
            'profile' => $profile,
        ]);
    }

    public function show(ClientContract $contrato)
    {
        $profile = ClientProfile::query()
            ->where('platform_user_id', auth()->id())
            ->first();

        abort_if(
            $contrato->client_profile_id !== $profile?->id,
            403,
            'Acesso não autorizado a este contrato.'
        );

        $contrato->load(['proposal.concessionaria', 'clientProfile.contacts']);

        return Inertia::render('Cliente/Contrato/Show/Page', [
            'contrato' => $contrato,
            'profile' => $profile,
        ]);
    }
}
