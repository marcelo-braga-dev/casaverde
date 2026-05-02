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

        $service->handle(
            $clientProfile,
            (int) $request->validated()['usina_id'],
            $request->validated()['started_at'],
            $request->validated()['notes'] ?? null,
        );

        return redirect()
            ->back()
            ->with('success', 'Cliente vinculado à usina com sucesso.');
    }
}
