<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use InvalidArgumentException;

class ApproveCustomerChargeService
{
    public function handle(CustomerCharge $charge): CustomerCharge
    {
        if ($charge->status !== 'draft') {
            throw new InvalidArgumentException('Apenas cobranças em rascunho podem ser abertas/aprovadas.');
        }

        $charge->update([
            'status' => 'open',
            'approved_by_user_id' => auth()->id(),
            'approved_at' => now(),
        ]);

        $charge = $charge->fresh();

        CustomerChargeHistory::log($charge, 'approved', 'Cobrança aberta para pagamento.');

        return $charge;
    }
}
