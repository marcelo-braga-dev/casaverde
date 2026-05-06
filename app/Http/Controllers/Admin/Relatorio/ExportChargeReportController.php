<?php

namespace App\Http\Controllers\Admin\Relatorio;

use App\Exports\Admin\Reports\ChargeReportExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class ExportChargeReportController extends Controller
{
    public function __invoke()
    {
        $filters = request()->only([
            'start_date',
            'end_date',
            'status',
            'reference_month',
            'reference_year',
        ]);

        return Excel::download(
            new ChargeReportExport($filters),
            'relatorio-cobrancas.xlsx'
        );
    }
}
