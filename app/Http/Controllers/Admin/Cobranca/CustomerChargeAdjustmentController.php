<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cobranca\StoreCustomerChargeAdjustmentRequest;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Cobranca\AddCustomerChargeAdjustmentService;
use InvalidArgumentException;

class CustomerChargeAdjustmentController extends Controller
{
    public function store(
        CustomerCharge $cobranca,
        StoreCustomerChargeAdjustmentRequest $request,
        AddCustomerChargeAdjustmentService $service
    ) {
        $this->authorize('update', $cobranca);

        try {
            $service->handle($cobranca, $request->validated(), auth()->id());

            return redirect()
                ->back()
                ->with('success', 'Ajuste adicionado com sucesso.');
        } catch (InvalidArgumentException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
