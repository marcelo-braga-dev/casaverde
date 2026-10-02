<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use App\Services\Pagamento\CancelPaymentSlipService;
use App\Services\Pagamento\PaymentSlipExpiredAlertService;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class MarkCustomerChargeAsPaidService
{
    public function __construct(
        private readonly CancelPaymentSlipService $cancelPaymentSlipService,
        private readonly PaymentSlipExpiredAlertService $expiredAlertService,
    ) {}

    public function handle(CustomerCharge $charge, ?string $note = null): CustomerCharge
    {
        if ($charge->status === 'cancelled') {
            throw new InvalidArgumentException('Não é possível pagar uma cobrança cancelada.');
        }

        if ($charge->status === 'paid') {
            throw new InvalidArgumentException('Esta cobrança já está paga.');
        }

        // Pago por fora (transferência, dinheiro): o boleto/Pix emitido precisa morrer no
        // provider, senão o cliente ainda consegue pagar de novo.
        $this->cancelPaymentSlipService->cancelActiveSlipsOf($charge);

        if ($charge->refresh()->status === 'paid') {
            return $charge;
        }

        return DB::transaction(function () use ($charge, $note) {
            $notes = trim(($charge->notes ? $charge->notes."\n" : '').($note ? 'Pagamento manual: '.$note : 'Cobrança marcada como paga manualmente.'));

            $charge->update([
                'status' => 'paid',
                'paid_at' => now(),
                'notes' => $notes,
            ]);

            $charge = $charge->fresh();

            $this->expiredAlertService->resolveFor($charge, 'Cobrança marcada como paga manualmente.');

            CustomerChargeHistory::log(
                $charge,
                'marked_paid',
                $note ? 'Pagamento manual: '.$note : 'Cobrança marcada como paga manualmente.'
            );

            return $charge;
        });
    }
}
