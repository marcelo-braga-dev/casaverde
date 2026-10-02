<?php

namespace App\Services\Pagamento;

use App\Models\Cobranca\CustomerChargeHistory;
use App\Models\Pagamento\PaymentSlip;
use Illuminate\Support\Facades\DB;

/**
 * Marca como vencido um boleto/Pix cuja data passou sem pagamento confirmado.
 *
 * Não cancela no provider: um boleto pago no último dia ainda pode levar até 3 dias
 * úteis para compensar, e cancelar o pedido no Mercado Pago faria esse pagamento
 * legítimo ser estornado. Pagamentos feitos após o vencimento o próprio MP devolve
 * ao pagador. O sync continua consultando o slip vencido por alguns dias.
 */
class ExpirePaymentSlipService
{
    public function __construct(
        private readonly PaymentSlipExpiredAlertService $alertService,
    ) {}

    public function handle(PaymentSlip $slip): void
    {
        if (! in_array($slip->status, ['pending', 'generated'], true)) {
            return;
        }

        $dueDate = $slip->effectiveDueDate();

        if (! $dueDate || ! $dueDate->lt(today())) {
            return;
        }

        DB::transaction(function () use ($slip, $dueDate) {
            $slip->update([
                'status' => 'expired',
                'error_message' => "Vencido em {$dueDate->format('d/m/Y')} sem pagamento confirmado.",
            ]);

            $charge = $slip->charge;

            if (! $charge || in_array($charge->status, ['paid', 'cancelled'], true)) {
                return;
            }

            $charge->update([
                'status' => $charge->due_date && $charge->due_date->lt(today()) ? 'overdue' : 'open',
            ]);

            CustomerChargeHistory::log(
                $charge->fresh(),
                'payment_slip_expired',
                "Boleto/Pix #{$slip->id} venceu em {$dueDate->format('d/m/Y')} sem pagamento e não pode mais ser pago. É preciso gerar um novo boleto e enviá-lo ao cliente."
            );
        });

        if ($slip->charge && ! in_array($slip->charge->fresh()->status, ['paid', 'cancelled'], true)) {
            $this->alertService->notify($slip->charge->fresh());
        }
    }
}
