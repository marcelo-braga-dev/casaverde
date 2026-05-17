<?php

namespace App\Http\Controllers\Admin\Cockpit;

use App\Http\Controllers\Controller;
use App\Services\Admin\ExecutiveCockpitService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminExecutiveCockpitController extends Controller
{
    public function __invoke(
        Request $request,
        ExecutiveCockpitService $service
    ): Response {
        $filters = [
            'year' => $request->integer('year') ?: now()->year,
            'month' => $request->integer('month') ?: now()->month,
        ];

        return Inertia::render('Admin/Cockpit/Executive/Page', [
            'filters' => $filters,
            'cockpit' => $service->handle($filters),
        ]);
    }
}
