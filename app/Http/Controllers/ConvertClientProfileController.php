<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Services\Cliente\ConvertProspectToActiveClientService;

class ConvertClientProfileController extends Controller
{
    public function store(
        ClientProfile $clientProfile,
        ConvertProspectToActiveClientService $service
    ) {
        $this->authorize('update', $clientProfile);

        $service->handle($clientProfile);

        return redirect()
            ->back()
            ->with('success', 'Cliente convertido para ativo com sucesso.');
    }
}