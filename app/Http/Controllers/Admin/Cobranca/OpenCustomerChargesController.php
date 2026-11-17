<?php

namespace App\Http\Controllers\Admin\Cobranca;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cobranca\OpenCustomerChargesRequest;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Cobranca\ApproveCustomerChargeService;

class OpenCustomerChargesController extends Controller
{
    public function store(OpenCustomerChargesRequest $request, ApproveCustomerChargeService $service)
    {
        $charges = CustomerCharge::query()
            ->somenteMinhasCobrancas()
            ->whereIn('id', $request->validated('ids'));

        $result = $service->handleMany($charges, $request->validated('due_date'));

        $message = "{$result['opened']} cobrança(s) aberta(s).";

        if ($result['skipped'] !== []) {
            $message .= ' '.count($result['skipped']).' não aberta(s): '
                .collect($result['skipped'])->map(fn ($reason, $id) => "#{$id} — {$reason}")->implode(' | ');
        }

        return redirect()->back()->with($result['opened'] > 0 ? 'success' : 'error', $message);
    }
}
