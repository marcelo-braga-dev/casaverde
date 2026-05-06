<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\ClientReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientReportController extends Controller
{
    public function __invoke(Request $request, ClientReportService $service)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
        ]);

        return Inertia::render('Admin/Relatorio/Cliente/Page', [
            'report' => $service->handle($filters),
            'filters' => $filters,
        ]);
    }
}
