<?php

namespace App\Services\Fatura;

use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Support\Collection;
use InvalidArgumentException;

class ApproveConcessionaireBillService
{
    /**
     * Motivos que impedem aprovar. Espelha a validação da tela da fatura e acrescenta o que
     * faria a cobrança nascer errada (sem consumo injetado ela sairia zerada).
     *
     * @return list<string>
     */
    public function blockers(ConcessionaireBill $bill): array
    {
        $blockers = [];

        $required = [
            'nome' => 'nome do titular',
            'unidade_consumidora' => 'unidade consumidora',
            'numero_instalacao' => 'número da instalação',
            'reference_month' => 'mês de referência',
            'reference_year' => 'ano de referência',
            'vencimento' => 'vencimento',
            'concessionaria_id' => 'concessionária',
            'pdf_original_name' => 'PDF',
        ];

        foreach ($required as $field => $label) {
            if (blank($bill->{$field})) {
                $blockers[] = "Falta {$label}";
            }
        }

        if ((float) $bill->valor_total <= 0) {
            $blockers[] = 'Valor total inválido';
        }

        if ((float) $bill->consumo_kwh <= 0) {
            $blockers[] = 'Consumo kWh inválido';
        }

        if (abs((float) $bill->injected_consumption_amount) <= 0) {
            $blockers[] = 'Sem valor de consumo injetado (a cobrança sairia zerada)';
        }

        $openIssues = $bill->relationLoaded('issues')
            ? $bill->issues->where('is_resolved', false)->whereIn('severity', ['error', 'critical'])->count()
            : $bill->issues()->where('is_resolved', false)->whereIn('severity', ['error', 'critical'])->count();

        if ($openIssues > 0) {
            $blockers[] = "{$openIssues} pendência(s) em aberto";
        }

        return $blockers;
    }

    public function handle(ConcessionaireBill $bill): ConcessionaireBill
    {
        if ($bill->review_status === 'approved') {
            throw new InvalidArgumentException('Esta fatura já está aprovada.');
        }

        $blockers = $this->blockers($bill);

        if ($blockers !== []) {
            throw new InvalidArgumentException('Não é possível aprovar: '.implode('; ', $blockers).'.');
        }

        $bill->update([
            'review_status' => 'approved',
            'reviewed_by_user_id' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return $bill->fresh();
    }

    /**
     * @param  iterable<int>  $ids
     * @return array{approved: int, skipped: array<int, string>}
     */
    public function handleMany(iterable $ids): array
    {
        $result = ['approved' => 0, 'skipped' => []];

        ConcessionaireBill::query()
            ->with('issues')
            ->whereIn('id', Collection::make($ids)->map(fn ($id) => (int) $id)->unique())
            ->get()
            ->each(function (ConcessionaireBill $bill) use (&$result) {
                try {
                    $this->handle($bill);
                    $result['approved']++;
                } catch (InvalidArgumentException $e) {
                    $result['skipped'][$bill->id] = $e->getMessage();
                }
            });

        return $result;
    }
}
