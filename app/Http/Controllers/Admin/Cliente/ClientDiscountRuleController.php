<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreClientDiscountRuleRequest;
use App\Models\Cliente\ClientProfile;
use App\Services\Cliente\StoreDiscountRuleService;

class ClientDiscountRuleController extends Controller
{
    public function store(
        ClientProfile $clientProfile,
        StoreClientDiscountRuleRequest $request,
        StoreDiscountRuleService $service
    ) {
        $this->authorize('update', $clientProfile);

        $service->handle(
            $clientProfile,
            (float) $request->validated()['discount_percent'],
            $request->validated()['starts_on'],
            $request->validated()['notes'] ?? null,
        );

        return redirect()
            ->back()
            ->with('success', 'Regra de desconto registrada com sucesso.');
    }
}
