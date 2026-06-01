<?php

namespace App\Http\Controllers\Cliente\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Cliente\Dashboard\ClienteDashboardService;
use Inertia\Inertia;

class ClienteDashboardController extends Controller
{
    public function __invoke(ClienteDashboardService $service)
    {
        return Inertia::render('Cliente/Dashboard/Page', [
            'dashboard' => $service->handle(auth()->id()),
        ]);
    }
}
