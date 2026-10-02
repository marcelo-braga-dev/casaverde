<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use App\Services\Pagamento\ReissuePaymentSlipService;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

class UpdateCustomerChargeDueDateService
{
    public function __construct(
        private readonly ReissuePaymentSlipService $reissuePaymentSlipService,
    ) {}

    public function handle(CustomerCharge $charge, string $dueDate): CustomerCharge
    {
        if (in_array($charge->status, ['paid', 'cancelled'], true)) {
            throw new InvalidArgumentException('Não é possível alterar o vencimento de uma cobrança paga ou cancelada.');
        }

        $oldDueDate = $charge->due_date?->format('d/m/Y') ?? '—';

        $this->reissuePaymentSlipService->applyChange($charge, function () use ($charge, $dueDate, $oldDueDate) {
            $newStatus = $charge->status === 'overdue' && ! Carbon::parse($dueDate)->lt(today())
                ? 'open'
                : $charge->status;

            $charge->update(['due_date' => $dueDate, 'status' => $newStatus]);

            CustomerChargeHistory::log(
                $charge->fresh(),
                'due_date_updated',
                "Vencimento alterado de {$oldDueDate} para {$charge->due_date->format('d/m/Y')}."
            );
        });

        return $charge->fresh();
    }
}
