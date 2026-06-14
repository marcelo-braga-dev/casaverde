<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\AttachClientToUsinaRequest;
use App\Models\Cliente\ClientProfile;
use App\Services\Cliente\AttachClientToUsinaService;

class ClientUsinaLinkController extends Controller
{
    public function store(
        ClientProfile $clientProfile,
        AttachClientToUsinaRequest $request,
        AttachClientToUsinaService $service
    ) {
        $this->authorize('update', $clientProfile);

        $validated = $request->validated();

        $service->handle(
            clientProfile: $clientProfile,
            usinaId: (int) $validated['usina_id'],
            startedAt: $validated['started_at'],
            notes: $validated['notes'] ?? null,
            consumerUnitId: isset($validated['consumer_unit_id']) ? (int) $validated['consumer_unit_id'] : null,
        );

        return redirect()
            ->back()
            ->with('success', 'Cliente vinculado à usina com sucesso.');
    }
}
