<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\src\Roles\RoleUser;
use Inertia\Inertia;

class ClientDiscountHistoryController extends Controller
{
    public function index(ClientProfile $clientProfile)
    {
        $this->authorize('view', $clientProfile);

        abort_unless(auth()->user()?->role_id === RoleUser::$ADMIN, 403);

        return Inertia::render('Admin/Cliente/DiscountHistory/Page', [
            'client' => $clientProfile->load([
                'activeDiscountRule',
                'discountRules',
            ]),
        ]);
    }
}
