<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\SendClientAccessInviteRequest;
use App\Models\Cliente\ClientProfile;
use App\Services\Cliente\CreateClientAccessInviteService;

class ClientAccessInviteController extends Controller
{
    public function store(
        ClientProfile $clientProfile,
        SendClientAccessInviteRequest $request,
        CreateClientAccessInviteService $service
    ) {
        $this->authorize('update', $clientProfile);

        $service->handle(
            $clientProfile,
            $request->validated()['email'],
            (int) $request->validated()['expires_in_hours']
        );

        return redirect()
            ->back()
            ->with('success', 'Convite de ativação enviado com sucesso.');
    }
}