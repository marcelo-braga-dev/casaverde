<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Models\Cobranca\CustomerCharge;
use App\Repositories\Cobranca\CustomerChargeRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerChargeController extends Controller
{
    public function index(Request $request, CustomerChargeRepository $repository)
    {
        $filters = $request->only([
            'status',
            'client_profile_id',
            'client_name',
            'reference_month',
            'reference_year',
            'aguardando_novo_boleto',
        ]);

        return Inertia::render('Admin/Cobranca/Index/Page', [
            'charges' => $repository->paginate($filters, 20),
            'filters' => $filters,
            'statuses' => ['draft', 'open', 'waiting_payment', 'paid', 'overdue', 'cancelled'],
            'aguardandoNovoBoletoCount' => CustomerCharge::query()->somenteMinhasCobrancas()->aguardandoNovoBoleto()->count(),
        ]);
    }

    public function show(CustomerCharge $cobranca)
    {
        $this->authorize('view', $cobranca);

        return Inertia::render('Admin/Cobranca/Show/Page', [
            'charge' => $cobranca->load([
                'clientProfile',
                'platformUser',
                'usina',
                'concessionaria',
                'bill',
                'adjustments.createdBy',
                'generatedBy',
                'approvedBy',
                'paymentSlips.providerAccount',
                'paymentSlips.transactions',
                'histories.user',
            ]),
            'aguardandoNovoBoleto' => $cobranca->isAguardandoNovoBoleto(),
        ]);
    }
}
