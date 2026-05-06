<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Exports\Admin\Reports\BillReportExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class ExportBillReportController extends Controller
{
    public function __invoke()
    {
        $filters = request()->only([
            'start_date',
            'end_date',
            'review_status',
            'parser_status',
            'reference_month',
            'reference_year',
        ]);

        return Excel::download(
            new BillReportExport($filters),
            'relatorio-faturas.xlsx'
        );
    }
}
