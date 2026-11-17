<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use Illuminate\Database\Eloquent\Builder;
use InvalidArgumentException;

class ApproveCustomerChargeService
{
    public function __construct(
        private readonly UpdateCustomerChargeDueDateService $updateDueDateService,
    ) {}

    public function handle(CustomerCharge $charge): CustomerCharge
    {
        if (! $charge->isDraft()) {
            throw new InvalidArgumentException('Apenas cobranças em rascunho podem ser abertas/aprovadas.');
        }

        if ((float) $charge->final_amount <= 0) {
            throw new InvalidArgumentException('A cobrança está com valor zerado.');
        }

        // Abrir com vencimento passado a jogava direto em "vencida", sem o cliente ter sido cobrado.
        if ($charge->due_date && $charge->due_date->lt(today())) {
            throw new InvalidArgumentException("O vencimento ({$charge->due_date->format('d/m/Y')}) já passou. Atualize o vencimento antes de abrir.");
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

    /**
     * Abre em lote. $newDueDate só substitui o vencimento das cobranças cujo vencimento já
     * passou; as demais mantêm a data que já tinham.
     *
     * @param  Builder<CustomerCharge>  $charges  já restrito à carteira de quem executa
     * @return array{opened: int, skipped: array<int, string>}
     */
    public function handleMany(Builder $charges, ?string $newDueDate = null): array
    {
        $result = ['opened' => 0, 'skipped' => []];

        $charges->get()->each(function (CustomerCharge $charge) use ($newDueDate, &$result) {
            try {
                if ($newDueDate && $charge->isDraft() && $charge->due_date?->lt(today())) {
                    $charge = $this->updateDueDateService->handle($charge, $newDueDate);
                }

                $this->handle($charge);
                $result['opened']++;
            } catch (InvalidArgumentException $e) {
                $result['skipped'][$charge->id] = $e->getMessage();
            }
        });

        return $result;
    }
}
