<?php

namespace App\Http\Controllers\Consultor\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Consultor\Dashboard\ConsultorDashboardService;
use Inertia\Inertia;

class ConsultorDashboardController extends Controller
{
    public function __invoke(ConsultorDashboardService $service)
    {
        return Inertia::render('Consultor/Dashboard/Page', [
            'dashboard' => $service->handle(auth()->id()),
        ]);
    }
}
