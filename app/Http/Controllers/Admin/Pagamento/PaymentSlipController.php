<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Models\Pagamento\PaymentSlip;
use Inertia\Inertia;

class PaymentSlipController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Financeiro/Pagamento/Index/Page', [
            'payments' => PaymentSlip::query()
                ->with(['charge.clientProfile', 'providerAccount'])
                ->orderByDesc('id')
                ->paginate(20),
        ]);
    }

    public function show(PaymentSlip $pagamento)
    {
        return Inertia::render('Admin/Financeiro/Pagamento/Show/Page', [
            'payment' => $pagamento->load([
                'charge.clientProfile',
                'charge.usina',
                'charge.concessionaria',
                'providerAccount',
                'transactions',
            ]),
        ]);
    }
}
