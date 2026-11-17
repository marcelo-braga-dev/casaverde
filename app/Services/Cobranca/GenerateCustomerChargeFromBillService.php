<?php

namespace App\Services\Cobranca;

use App\Enums\Cobranca\CustomerChargeStatus;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class GenerateCustomerChargeFromBillService
{
    /**
     * A cobrança nasce aberta (a conferência foi feita na aprovação da fatura). Fica em
     * rascunho só quando não dá para cobrar ainda: valor zerado, ou vencimento da fatura
     * já passado sem uma nova data ($dueDate substitui apenas um vencimento passado).
     */
    public function handle(ConcessionaireBill $bill, ?string $dueDate = null): CustomerCharge
    {
        if ($bill->review_status !== 'approved') {
            throw new InvalidArgumentException('A cobrança só pode ser gerada a partir de uma fatura aprovada.');
        }

        $hasActiveCharge = CustomerCharge::query()
            ->where('concessionaire_bill_id', $bill->id)
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($hasActiveCharge) {
            throw new InvalidArgumentException('Já existe cobrança gerada para esta fatura.');
        }

        return DB::transaction(function () use ($bill, $dueDate) {
            $bill->loadMissing([
                'clientProfile.platformUser',
                'usina',
                'concessionaria',
            ]);

            // A cobrança ao cliente incide sobre o Consumo Injetado (total), não sobre o
            // valor total da fatura da concessionária — este último inclui taxas e tarifas
            // que não fazem parte do que é repassado ao cliente da assinatura.
            $originalAmount = abs((float) $bill->injected_consumption_amount);
            $discountPercent = (float) ($bill->injected_consumption_discount_percent ?? 0);
            $discountAmount = round($originalAmount * ($discountPercent / 100), 2);
            $finalAmount = max(0, $originalAmount - $discountAmount);

            $chargeDueDate = $bill->vencimento?->lt(today()) && $dueDate
                ? Carbon::parse($dueDate)
                : $bill->vencimento;
            $opens = $finalAmount > 0 && $chargeDueDate && ! $chargeDueDate->lt(today());

            $charge = CustomerCharge::create([
                'client_profile_id' => $bill->client_profile_id,
                'platform_user_id' => $bill->clientProfile?->platform_user_id,
                'usina_id' => $bill->usina_id,
                'concessionaria_id' => $bill->concessionaria_id,
                'concessionaire_bill_id' => $bill->id,
                'reference_month' => $bill->reference_month,
                'reference_year' => $bill->reference_year,
                'reference_label' => $bill->reference_label,
                'due_date' => $chargeDueDate,
                'original_amount' => $originalAmount,
                'discount_percent' => $discountPercent,
                'discount_amount' => $discountAmount,
                'manual_discount_amount' => 0,
                'manual_addition_amount' => 0,
                'final_amount' => $finalAmount,
                'status' => $opens ? CustomerChargeStatus::OPEN->value : CustomerChargeStatus::DRAFT->value,
                'generated_by_user_id' => auth()->id(),
                'approved_by_user_id' => $opens ? auth()->id() : null,
                'approved_at' => $opens ? now() : null,
            ]);

            CustomerChargeHistory::log(
                $charge,
                $opens ? 'approved' : 'generated',
                $opens
                    ? 'Cobrança gerada e aberta na aprovação da fatura.'
                    : 'Cobrança gerada em rascunho: '.($finalAmount > 0 ? 'o vencimento da fatura já passou, informe uma nova data para abrir.' : 'valor zerado.'),
            );

            return $charge;
        });
    }
}
