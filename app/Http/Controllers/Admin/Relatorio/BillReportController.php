<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\BillReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillReportController extends Controller
{
    public function __invoke(Request $request, BillReportService $service)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
            'review_status',
            'parser_status',
            'reference_month',
            'reference_year',
            'client_name',
        ]);

        return Inertia::render('Admin/Relatorio/Fatura/Page', [
            'report' => $service->handle($filters),
            'filters' => $filters,
            'reviewStatuses' => ['pending_review', 'reviewed', 'corrected', 'approved'],
            'parserStatuses' => ['pending', 'success', 'error'],
        ]);
    }
}
