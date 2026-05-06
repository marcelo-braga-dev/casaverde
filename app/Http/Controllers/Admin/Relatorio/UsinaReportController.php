<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\UsinaReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsinaReportController extends Controller
{
    public function __invoke(Request $request, UsinaReportService $service)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
        ]);

        return Inertia::render('Admin/Relatorio/Usina/Page', [
            'report' => $service->handle($filters),
            'filters' => $filters,
        ]);
    }
}
