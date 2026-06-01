<?php

namespace App\Http\Controllers\Cliente\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Cliente\Relatorio\ClienteEconomiaRelatorioService;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportClienteEconomiaPdfController extends Controller
{
    public function __invoke(ClienteEconomiaRelatorioService $service)
    {
        $filters = request()->only(['year', 'month']);

        $report = $service->handle(auth()->id(), $filters);

        $pdf = Pdf::loadView('pdf.cliente.economia', ['report' => $report]);

        $pdf->setPaper('a4', 'portrait');

        $year = $filters['year'] ?? now()->year;

        return $pdf->download("relatorio-economia-{$year}.pdf");
    }
}
