<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\Dashboard\AdminDashboardMetricsService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(AdminDashboardMetricsService $service)
    {
        return Inertia::render('Admin/Dashboard/Page', [
            'dashboard' => $service->handle(),
        ]);
    }
}
