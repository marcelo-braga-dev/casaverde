<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\BillReportService;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportBillReportPdfController extends Controller
{
    public function __invoke(BillReportService $service)
    {
        $filters = request()->only([
            'start_date',
            'end_date',
            'review_status',
            'parser_status',
            'reference_month',
            'reference_year',
        ]);

        $report = $service->handle($filters);

        $pdf = Pdf::loadView('pdf.admin.reports.bills', [
            'report' => $report,
        ]);

        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('relatorio-faturas.pdf');
    }
}
