<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\PaymentReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentReportController extends Controller
{
    public function __invoke(Request $request, PaymentReportService $service)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
            'status',
            'provider',
        ]);

        return Inertia::render('Admin/Relatorio/Pagamento/Page', [
            'report' => $service->handle($filters),
            'filters' => $filters,
            'statuses' => ['pending', 'generated', 'paid', 'cancelled', 'failed', 'expired'],
            'providers' => ['cora', 'mercado_pago', 'asaas'],
        ]);
    }
}
