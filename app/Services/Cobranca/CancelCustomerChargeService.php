<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use App\Services\Pagamento\CancelPaymentSlipService;
use App\Services\Pagamento\PaymentSlipExpiredAlertService;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CancelCustomerChargeService
{
    public function __construct(
        private readonly CancelPaymentSlipService $cancelPaymentSlipService,
        private readonly PaymentSlipExpiredAlertService $expiredAlertService,
    ) {}

    public function handle(CustomerCharge $charge, ?string $reason = null): CustomerCharge
    {
        if ($charge->status === 'paid') {
            throw new InvalidArgumentException('Não é possível cancelar uma cobrança já paga.');
        }

        if ($charge->status === 'cancelled') {
            throw new InvalidArgumentException('Esta cobrança já está cancelada.');
        }

        // Fora da transação: são chamadas HTTP ao provider, e se alguma falhar a cobrança
        // não pode ser cancelada com um boleto ainda pagável lá fora.
        $this->cancelPaymentSlipService->cancelActiveSlipsOf($charge);

        if ($charge->refresh()->status === 'paid') {
            throw new InvalidArgumentException('Não é possível cancelar uma cobrança já paga.');
        }

        return DB::transaction(function () use ($charge, $reason) {
            $charge->load('paymentSlips');

            foreach ($charge->paymentSlips as $paymentSlip) {
                if (! in_array($paymentSlip->status, ['paid', 'cancelled', 'expired', 'refunded'], true)) {
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

            $charge = $charge->fresh();

            $this->expiredAlertService->resolveFor($charge, 'Cobrança cancelada.');

            CustomerChargeHistory::log(
                $charge,
                'cancelled',
                $reason ? "Cobrança cancelada. Motivo: {$reason}" : 'Cobrança cancelada.'
            );

            return $charge;
        });
    }
}
