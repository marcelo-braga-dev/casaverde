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
            $referenceLabel = sprintf('%02d/%04d', (int) $data['reference_month'], (int) $data['reference_year']);

            $reviewStatus = $data['review_status'];

            $bill->update([
                'usina_id' => $data['usina_id'] ?? null,
                'concessionaria_id' => $data['concessionaria_id'],
                'reference_month' => $data['reference_month'],
                'reference_year' => $data['reference_year'],
                'reference_label' => $referenceLabel,
                'unidade_consumidora' => preg_replace('/\D+/', '', $data['unidade_consumidora']),
                'numero_instalacao' => $data['numero_instalacao'] ?? null,
                'vencimento' => $data['vencimento'],
                'valor_total' => $data['valor_total'],
                'consumo_kwh' => $data['consumo_kwh'] ?? null,
                'notes' => $data['notes'] ?? null,
                'review_status' => $reviewStatus,
                'reviewed_by_user_id' => auth()->id(),
                'reviewed_at' => now(),
            ]);

            $this->validateConcessionaireBillService->handle($bill->fresh());

            return $bill->fresh();
        });
    }
}