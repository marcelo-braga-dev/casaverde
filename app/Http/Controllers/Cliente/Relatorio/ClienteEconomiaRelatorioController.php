<?php

namespace App\Http\Controllers\Cliente\Relatorio;

use App\Http\Controllers\Controller;
use App\Services\Cliente\Relatorio\ClienteEconomiaRelatorioService;
use Inertia\Inertia;

class ClienteEconomiaRelatorioController extends Controller
{
    public function __invoke(ClienteEconomiaRelatorioService $service)
    {
        $filters = request()->only(['year', 'month']);

        return Inertia::render('Cliente/Relatorios/Economia/Page', [
            'report' => $service->handle(auth()->id(), $filters),
        ]);
    }
}
