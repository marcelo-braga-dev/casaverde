<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;

class RecalculateCustomerChargeService
{
    public function handle(CustomerCharge $charge): CustomerCharge
    {
        $manualDiscount = (float) $charge->adjustments()
            ->where('type', 'discount')
            ->sum('amount');

        $manualAddition = (float) $charge->adjustments()
            ->where('type', 'addition')
            ->sum('amount');

        $finalAmount = max(
            0,
            (float) $charge->original_amount
            - (float) $charge->discount_amount
            - $manualDiscount
            + $manualAddition
        );

        $charge->update([
            'manual_discount_amount' => $manualDiscount,
            'manual_addition_amount' => $manualAddition,
            'final_amount' => $finalAmount,
        ]);

        return $charge->fresh();
    }
}
