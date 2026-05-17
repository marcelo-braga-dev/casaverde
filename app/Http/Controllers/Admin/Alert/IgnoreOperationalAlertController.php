<?php

namespace App\Http\Controllers\Admin\Alert;

use App\Enums\Alert\OperationalAlertStatus;
use App\Http\Controllers\Controller;
use App\Models\Alert\OperationalAlert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class IgnoreOperationalAlertController extends Controller
{
    public function __invoke(Request $request, OperationalAlert $alert): RedirectResponse
    {
        $request->validate([
            'resolution_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $alert->update([
            'status' => OperationalAlertStatus::Ignored->value,
            'resolved_at' => now(),
            'resolved_by_user_id' => auth()->id(),
            'resolution_notes' => $request->input('resolution_notes'),
        ]);

        return back()->with('success', 'Alerta ignorado com sucesso.');
    }
}
