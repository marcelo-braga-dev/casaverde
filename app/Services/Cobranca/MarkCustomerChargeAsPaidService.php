<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class MarkCustomerChargeAsPaidService
{
    public function handle(CustomerCharge $charge, ?string $note = null): CustomerCharge
    {
        if ($charge->status === 'cancelled') {
            throw new InvalidArgumentException('Não é possível pagar uma cobrança cancelada.');
        }

        if ($charge->status === 'paid') {
            throw new InvalidArgumentException('Esta cobrança já está paga.');
        }

        return DB::transaction(function () use ($charge, $note) {
            $notes = trim(($charge->notes ? $charge->notes . "\n" : '') . ($note ? 'Pagamento manual: ' . $note : 'Cobrança marcada como paga manualmente.'));

            $charge->update([
                'status' => 'paid',
                'paid_at' => now(),
                'notes' => $notes,
            ]);

            return $charge->fresh();
        });
    }
}
