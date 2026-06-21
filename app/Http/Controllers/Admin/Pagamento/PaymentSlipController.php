<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Models\Pagamento\PaymentSlip;
use App\Repositories\Pagamento\PaymentSlipRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentSlipController extends Controller
{
    public function index(Request $request, PaymentSlipRepository $repository)
    {
        $filters = $request->only([
            'status',
            'provider',
            'payment_method',
            'client_name',
            'due_date_start',
            'due_date_end',
        ]);

        return Inertia::render('Admin/Financeiro/Pagamento/Index/Page', [
            'payments' => $repository->paginate($filters, 20),
            'filters' => $filters,
            'statuses' => ['pending', 'generated', 'paid', 'cancelled', 'failed', 'expired'],
            'providers' => ['cora', 'mercado_pago', 'asaas'],
            'paymentMethods' => ['boleto', 'pix', 'boleto_pix'],
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
