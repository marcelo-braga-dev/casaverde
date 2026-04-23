<?php

namespace App\Services\Fatura;

use App\Models\Fatura\ConcessionaireBill;

class SuggestBillUsinaService
{
    public function handle(ConcessionaireBill $bill): ?int
    {
        $bill->load('clientProfile.activeUsinaLink');

        return $bill->clientProfile?->activeUsinaLink?->usina_id;
    }
}