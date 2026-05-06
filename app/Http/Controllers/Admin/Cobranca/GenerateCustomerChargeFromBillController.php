<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Models\Fatura\ConcessionaireBill;
use App\Services\Cobranca\GenerateCustomerChargeFromBillService;
use InvalidArgumentException;

class GenerateCustomerChargeFromBillController extends Controller
{
    public function store(
        ConcessionaireBill $fatura,
        GenerateCustomerChargeFromBillService $service
    ) {
        try {
            $charge = $service->handle($fatura);

            return redirect()
                ->route('admin.cobrancas.show', $charge->id)
                ->with('success', 'Cobrança gerada com sucesso.');
        } catch (InvalidArgumentException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
