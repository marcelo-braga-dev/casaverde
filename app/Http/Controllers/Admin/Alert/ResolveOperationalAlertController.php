<?php

namespace App\Http\Controllers\Admin\Alert;

use App\Http\Controllers\Controller;
use App\Models\Alert\OperationalAlert;
use App\Services\Alert\ResolveOperationalAlertService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ResolveOperationalAlertController extends Controller
{
    public function __invoke(
        Request $request,
        OperationalAlert $alert,
        ResolveOperationalAlertService $service
    ): RedirectResponse {
        $request->validate([
            'resolution_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $service->handle(
            alert: $alert,
            notes: $request->input('resolution_notes'),
            resolvedByUserId: auth()->id(),
        );

        return back()->with('success', 'Alerta resolvido com sucesso.');
    }
}
