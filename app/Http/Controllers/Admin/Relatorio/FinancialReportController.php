<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\FinancialReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialReportController extends Controller
{
    public function __invoke(Request $request, FinancialReportService $service)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
        ]);

        return Inertia::render('Admin/Relatorio/Financeiro/Page', [
            'report' => $service->handle($filters),
            'filters' => $filters,
        ]);
    }
}
