<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\ChargeReportService;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportChargeReportPdfController extends Controller
{
    public function __invoke(ChargeReportService $service)
    {
        $filters = request()->only([
            'start_date',
            'end_date',
            'status',
            'reference_month',
            'reference_year',
        ]);

        $report = $service->handle($filters);

        $pdf = Pdf::loadView('pdf.admin.reports.charges', [
            'report' => $report,
        ]);

        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('relatorio-cobrancas.pdf');
    }
}
