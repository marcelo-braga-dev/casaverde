<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
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
            $notes = trim(($charge->notes ? $charge->notes."\n" : '').($note ? 'Pagamento manual: '.$note : 'Cobrança marcada como paga manualmente.'));

            $charge->update([
                'status' => 'paid',
                'paid_at' => now(),
                'notes' => $notes,
            ]);

            $charge = $charge->fresh();

            CustomerChargeHistory::log(
                $charge,
                'marked_paid',
                $note ? 'Pagamento manual: '.$note : 'Cobrança marcada como paga manualmente.'
            );

            return $charge;
        });
    }
}
