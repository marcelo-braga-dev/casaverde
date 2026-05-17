<?php

namespace App\Http\Controllers\Admin\Financeiro;

use App\Http\Controllers\Controller;
use App\Services\Admin\BillingManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminBillingManagementController extends Controller
{
    public function __invoke(
        Request $request,
        BillingManagementService $service
    ): Response {
        $filters = [
            'year' => $request->integer('year') ?: now()->year,
            'month' => $request->integer('month') ?: now()->month,
        ];

        return Inertia::render('Admin/Financeiro/BillingManagement/Page', [
            'filters' => $filters,
            'billing' => $service->handle($filters),
        ]);
    }
}
