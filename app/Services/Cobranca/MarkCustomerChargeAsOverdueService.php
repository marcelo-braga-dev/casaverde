<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use InvalidArgumentException;

class MarkCustomerChargeAsOverdueService
{
    public function handle(CustomerCharge $charge): CustomerCharge
    {
        if (! in_array($charge->status, ['open', 'waiting_payment'], true)) {
            throw new InvalidArgumentException('Apenas cobranças abertas podem ser marcadas como atrasadas.');
        }

        $charge->update([
            'status' => 'overdue',
        ]);

        return $charge->fresh();
    }
}
