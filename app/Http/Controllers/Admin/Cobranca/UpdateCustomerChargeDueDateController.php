<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cobranca\UpdateCustomerChargeDueDateRequest;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Cobranca\UpdateCustomerChargeDueDateService;
use InvalidArgumentException;

class UpdateCustomerChargeDueDateController extends Controller
{
    public function update(
        CustomerCharge $cobranca,
        UpdateCustomerChargeDueDateRequest $request,
        UpdateCustomerChargeDueDateService $service
    ) {
        $this->authorize('update', $cobranca);

        try {
            $service->handle($cobranca, $request->validated('due_date'));

            return redirect()
                ->back()
                ->with('success', 'Vencimento atualizado com sucesso.');
        } catch (InvalidArgumentException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
