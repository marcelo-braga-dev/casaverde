<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\ChargeReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChargeReportController extends Controller
{
    public function __invoke(Request $request, ChargeReportService $service)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
            'status',
            'reference_month',
            'reference_year',
        ]);

        return Inertia::render('Admin/Relatorio/Cobranca/Page', [
            'report' => $service->handle($filters),
            'filters' => $filters,
            'statuses' => ['draft', 'open', 'waiting_payment', 'paid', 'overdue', 'cancelled'],
        ]);
    }
}
