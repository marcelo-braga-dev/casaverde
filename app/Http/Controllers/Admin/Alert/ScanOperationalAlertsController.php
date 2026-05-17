<?php

namespace App\Http\Controllers\Admin\Alert;

use App\Http\Controllers\Controller;
use App\Services\Usina\ScanUsinaOperationalAlertsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ScanOperationalAlertsController extends Controller
{
    public function __invoke(
        Request $request,
        ScanUsinaOperationalAlertsService $service
    ): RedirectResponse {
        $service->handle(
            year: $request->integer('reference_year') ?: now()->year,
            month: $request->integer('reference_month') ?: now()->month,
            usinaId: $request->integer('usina_id') ?: null,
        );

        return back()->with('success', 'Scanner de alertas executado com sucesso.');
    }
}
