<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cobranca\MarkCustomerChargeAsPaidRequest;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Cobranca\MarkCustomerChargeAsPaidService;
use InvalidArgumentException;

class MarkCustomerChargeAsPaidController extends Controller
{
    public function store(
        CustomerCharge $cobranca,
        MarkCustomerChargeAsPaidRequest $request,
        MarkCustomerChargeAsPaidService $service
    ) {
        try {
            $service->handle($cobranca, $request->validated('note'));

            return redirect()
                ->back()
                ->with('success', 'Cobrança marcada como paga com sucesso.');
        } catch (InvalidArgumentException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
