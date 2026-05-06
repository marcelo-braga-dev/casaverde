<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Cobranca\MarkCustomerChargeAsOverdueService;
use InvalidArgumentException;

class MarkCustomerChargeAsOverdueController extends Controller
{
    public function store(CustomerCharge $cobranca, MarkCustomerChargeAsOverdueService $service)
    {
        try {
            $service->handle($cobranca);

            return redirect()
                ->back()
                ->with('success', 'Cobrança marcada como atrasada.');
        } catch (InvalidArgumentException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
