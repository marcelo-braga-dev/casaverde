<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cobranca\CancelCustomerChargeRequest;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Cobranca\CancelCustomerChargeService;
use InvalidArgumentException;

class CancelCustomerChargeController extends Controller
{
    public function store(
        CustomerCharge $cobranca,
        CancelCustomerChargeRequest $request,
        CancelCustomerChargeService $service
    ) {
        try {
            $service->handle($cobranca, $request->validated('reason'));

            return redirect()
                ->back()
                ->with('success', 'Cobrança cancelada com sucesso.');
        } catch (InvalidArgumentException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
