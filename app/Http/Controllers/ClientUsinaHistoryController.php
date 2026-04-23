<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use Inertia\Inertia;

class ClientUsinaHistoryController extends Controller
{
    public function index(ClientProfile $clientProfile)
    {
        $this->authorize('view', $clientProfile);

        return Inertia::render('Admin/Cliente/UsinaHistory/Page', [
            'client' => $clientProfile->load([
                'activeUsinaLink.usina',
                'usinaLinks.usina',
            ]),
        ]);
    }
}