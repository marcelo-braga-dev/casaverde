<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cobranca\StoreCustomerChargeAdjustmentRequest;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeAdjustment;
use App\Services\Cobranca\RecalculateCustomerChargeService;

class CustomerChargeAdjustmentController extends Controller
{
    public function store(
        CustomerCharge $cobranca,
        StoreCustomerChargeAdjustmentRequest $request,
        RecalculateCustomerChargeService $service
    ) {
        CustomerChargeAdjustment::create([
            'customer_charge_id' => $cobranca->id,
            'created_by_user_id' => auth()->id(),
            ...$request->validated(),
        ]);

        $service->handle($cobranca);

        return redirect()
            ->back()
            ->with('success', 'Ajuste adicionado com sucesso.');
    }
}
