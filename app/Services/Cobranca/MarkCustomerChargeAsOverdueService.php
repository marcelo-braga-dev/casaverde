<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use InvalidArgumentException;

class MarkCustomerChargeAsOverdueService
{
    public function handle(CustomerCharge $charge): CustomerCharge
    {
        if ($charge->status !== 'open') {
            throw new InvalidArgumentException('Apenas cobranças abertas podem ser marcadas como atrasadas.');
        }

        $charge->update([
            'status' => 'overdue',
        ]);

        $charge = $charge->fresh();

        CustomerChargeHistory::log($charge, 'marked_overdue', 'Marcada como atrasada manualmente.');

        return $charge;
    }
}
