<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Admin\Dashboard\AdminDashboardService;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __invoke(AdminDashboardService $service)
    {
        return Inertia::render('Admin/Dashboard/Page', [
            'dashboard' => $service->handle(),
        ]);
    }
}
