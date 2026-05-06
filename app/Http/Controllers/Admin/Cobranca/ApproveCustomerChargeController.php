<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Cobranca\ApproveCustomerChargeService;
use InvalidArgumentException;

class ApproveCustomerChargeController extends Controller
{
    public function store(CustomerCharge $cobranca, ApproveCustomerChargeService $service)
    {
        try {
            $service->handle($cobranca);

            return redirect()
                ->back()
                ->with('success', 'Cobrança aberta com sucesso.');
        } catch (InvalidArgumentException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
