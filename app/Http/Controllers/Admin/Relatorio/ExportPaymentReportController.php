<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Exports\Admin\Reports\PaymentReportExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class ExportPaymentReportController extends Controller
{
    public function __invoke()
    {
        $filters = request()->only([
            'start_date',
            'end_date',
            'status',
            'provider',
        ]);

        return Excel::download(
            new PaymentReportExport($filters),
            'relatorio-pagamentos.xlsx'
        );
    }
}
