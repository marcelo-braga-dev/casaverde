<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use InvalidArgumentException;

class UpdateCustomerChargeDueDateService
{
    public function handle(CustomerCharge $charge, string $dueDate): CustomerCharge
    {
        if (in_array($charge->status, ['paid', 'cancelled'], true)) {
            throw new InvalidArgumentException('Não é possível alterar o vencimento de uma cobrança paga ou cancelada.');
        }

        $oldDueDate = $charge->due_date?->format('d/m/Y') ?? '—';

        $charge->update(['due_date' => $dueDate]);
        $charge = $charge->fresh();

        CustomerChargeHistory::log(
            $charge,
            'due_date_updated',
            "Vencimento alterado de {$oldDueDate} para {$charge->due_date->format('d/m/Y')}."
        );

        return $charge;
    }
}
