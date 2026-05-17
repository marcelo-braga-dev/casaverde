<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Alert\OperationalAlert;
use App\Services\Admin\Dashboard\AdminDashboardService;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __invoke(AdminDashboardService $service)
    {
        return Inertia::render('Admin/Dashboard/Page', [
            'dashboard' => $service->handle(),
            'operationalAlertsSummary' => [
                'open' => OperationalAlert::query()->where('status', 'open')->count(),
                'critical' => OperationalAlert::query()
                    ->where('status', 'open')
                    ->where('severity', 'critical')
                    ->count(),
                'error' => OperationalAlert::query()
                    ->where('status', 'open')
                    ->where('severity', 'error')
                    ->count(),
                'warning' => OperationalAlert::query()
                    ->where('status', 'open')
                    ->where('severity', 'warning')
                    ->count(),
            ],
        ]);
    }
}
