<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class GenerateCustomerChargeFromBillService
{
    public function handle(ConcessionaireBill $bill): CustomerCharge
    {
        if ($bill->review_status !== 'approved') {
            throw new InvalidArgumentException('A cobrança só pode ser gerada a partir de uma fatura aprovada.');
        }

        if (CustomerCharge::query()->where('concessionaire_bill_id', $bill->id)->exists()) {
            throw new InvalidArgumentException('Já existe cobrança gerada para esta fatura.');
        }

        return DB::transaction(function () use ($bill) {
            $bill->loadMissing([
                'clientProfile.activeDiscountRule',
                'clientProfile.platformUser',
                'usina',
                'concessionaria',
            ]);

            $discountPercent = (float) ($bill->clientProfile?->activeDiscountRule?->discount_percent ?? 0);
            $originalAmount = (float) $bill->valor_total;
            $discountAmount = round($originalAmount * ($discountPercent / 100), 2);
            $finalAmount = max(0, $originalAmount - $discountAmount);

            return CustomerCharge::create([
                'client_profile_id' => $bill->client_profile_id,
                'platform_user_id' => $bill->clientProfile?->platform_user_id,
                'usina_id' => $bill->usina_id,
                'concessionaria_id' => $bill->concessionaria_id,
                'concessionaire_bill_id' => $bill->id,
                'reference_month' => $bill->reference_month,
                'reference_year' => $bill->reference_year,
                'reference_label' => $bill->reference_label,
                'due_date' => $bill->vencimento,
                'original_amount' => $originalAmount,
                'discount_percent' => $discountPercent,
                'discount_amount' => $discountAmount,
                'manual_discount_amount' => 0,
                'manual_addition_amount' => 0,
                'final_amount' => $finalAmount,
                'status' => 'draft',
                'generated_by_user_id' => auth()->id(),
            ]);
        });
    }
}
