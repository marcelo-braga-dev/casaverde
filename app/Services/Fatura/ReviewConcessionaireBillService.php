<?php

namespace App\Services\Fatura;

use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Support\Facades\DB;

class ReviewConcessionaireBillService
{
    public function __construct(
        private readonly ValidateConcessionaireBillService $validateConcessionaireBillService
    ) {
    }

    public function handle(ConcessionaireBill $bill, array $data): ConcessionaireBill
    {
        return DB::transaction(function () use ($bill, $data) {
            $referenceMonth = $this->nullableInteger($data['reference_month'] ?? null);
            $referenceYear = $this->nullableInteger($data['reference_year'] ?? null);

            $referenceLabel = $this->nullableString($data['reference_label'] ?? null);

            if ($referenceMonth && $referenceYear) {
                $referenceLabel = sprintf('%02d/%04d', $referenceMonth, $referenceYear);
            }

            $bill->forceFill([
                'usina_id' => $data['usina_id'] ?? null,
                'concessionaria_id' => $data['concessionaria_id'] ?? $bill->concessionaria_id,

                'nome' => $this->nullableString($data['nome'] ?? null),
                'unidade_consumidora' => $this->onlyNumbersOrNull($data['unidade_consumidora'] ?? null),
                'numero_instalacao' => $this->nullableString($data['numero_instalacao'] ?? null),

                'reference_month' => $referenceMonth,
                'reference_year' => $referenceYear,
                'reference_label' => $referenceLabel,

                'vencimento' => $data['vencimento'] ?? null,
                'valor_total' => $this->nullableDecimal($data['valor_total'] ?? null),
                'consumo_kwh' => $this->nullableDecimal($data['consumo_kwh'] ?? null),

                'notes' => $data['notes'] ?? null,
                'review_notes' => $data['review_notes'] ?? null,
                'review_status' => $data['review_status'] ?? $bill->review_status,

                'reviewed_by_user_id' => auth()->id(),
                'reviewed_by_id' => auth()->id(),
                'reviewed_at' => now(),
            ])->save();

            $bill = $bill->fresh();

            $this->validateConcessionaireBillService->handle($bill);

            return $bill->fresh();
        });
    }

    private function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function onlyNumbersOrNull(mixed $value): ?string
    {
        $value = $this->nullableString($value);

        if ($value === null) {
            return null;
        }

        $numbers = preg_replace('/\D+/', '', $value);

        if ($numbers === '' || $numbers === '0') {
            return null;
        }

        return $numbers;
    }

    private function nullableInteger(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    private function nullableDecimal(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_string($value)) {
            $value = trim($value);
            $value = str_replace(['R$', ' '], '', $value);

            $hasComma = str_contains($value, ',');
            $hasDot = str_contains($value, '.');

            if ($hasComma && $hasDot) {
                $value = str_replace('.', '', $value);
                $value = str_replace(',', '.', $value);
            } elseif ($hasComma) {
                $value = str_replace(',', '.', $value);
            }
        }

        if (!is_numeric($value)) {
            return null;
        }

        $number = (float) $value;

        return $number <= 0 ? null : $number;
    }
}
