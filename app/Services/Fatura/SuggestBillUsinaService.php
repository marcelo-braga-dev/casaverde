<?php

namespace App\Services\Fatura;

use App\Models\Fatura\ConcessionaireBill;

class SuggestBillUsinaService
{
    public function handle(ConcessionaireBill $bill): ?int
    {
        $bill->load(['consumerUnit.activeUsinaLink', 'clientProfile.activeUsinaLink']);

        return $bill->consumerUnit?->activeUsinaLink?->usina_id
            ?? $bill->clientProfile?->activeUsinaLink?->usina_id;
    }
}