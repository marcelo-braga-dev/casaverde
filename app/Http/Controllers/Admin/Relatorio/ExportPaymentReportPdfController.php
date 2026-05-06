<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Admin\Reports\PaymentReportService;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportPaymentReportPdfController extends Controller
{
    public function __invoke(PaymentReportService $service)
    {
        $filters = request()->only([
            'start_date',
            'end_date',
            'status',
            'provider',
        ]);

        $report = $service->handle($filters);

        $pdf = Pdf::loadView('pdf.admin.reports.payments', [
            'report' => $report,
        ]);

        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('relatorio-pagamentos.pdf');
    }
}
