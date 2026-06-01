<?php

namespace App\Http\Controllers\Cliente\Relatorio;

use App\Exports\Cliente\ClienteEconomiaExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class ExportClienteEconomiaExcelController extends Controller
{
    public function __invoke()
    {
        $filters = request()->only(['year', 'month']);

        $year = $filters['year'] ?? now()->year;

        return Excel::download(
            new ClienteEconomiaExport(auth()->id(), $filters),
            "relatorio-economia-{$year}.xlsx"
        );
    }
}
