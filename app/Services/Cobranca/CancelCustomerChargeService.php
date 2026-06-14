<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CancelCustomerChargeService
{
    public function handle(CustomerCharge $charge, ?string $reason = null): CustomerCharge
    {
        if ($charge->status === 'paid') {
            throw new InvalidArgumentException('Não é possível cancelar uma cobrança já paga.');
        }

        if ($charge->status === 'cancelled') {
            throw new InvalidArgumentException('Esta cobrança já está cancelada.');
        }

        return DB::transaction(function () use ($charge, $reason) {
            $charge->loadMissing('paymentSlips');

            foreach ($charge->paymentSlips as $paymentSlip) {
                if (! in_array($paymentSlip->status, ['paid', 'cancelled', 'expired'], true)) {
                    $paymentSlip->update([
                        'status' => 'cancelled',
                        'cancelled_at' => now(),
                        'error_message' => 'Cancelado automaticamente porque a cobrança foi cancelada.',
                    ]);
                }
            }

            $notes = trim(($charge->notes ? $charge->notes."\n" : '').($reason ? 'Cancelamento: '.$reason : 'Cobrança cancelada.'));

            $charge->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'notes' => $notes,
            ]);

            return $charge->fresh();
        });
    }
}
