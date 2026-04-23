<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use Inertia\Inertia;

class ClientDiscountHistoryController extends Controller
{
    public function index(ClientProfile $clientProfile)
    {
        $this->authorize('view', $clientProfile);

        return Inertia::render('Admin/Cliente/DiscountHistory/Page', [
            'client' => $clientProfile->load([
                'activeDiscountRule',
                'discountRules',
            ]),
        ]);
    }
}