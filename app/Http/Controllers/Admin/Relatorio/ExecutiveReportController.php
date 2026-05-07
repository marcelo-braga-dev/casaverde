<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\ExecutiveReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExecutiveReportController extends Controller
{
    public function __invoke(Request $request, ExecutiveReportService $service)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
        ]);

        return Inertia::render('Admin/Relatorio/Executivo/Page', [
            'report' => $service->handle($filters),
            'filters' => $filters,
        ]);
    }
}
