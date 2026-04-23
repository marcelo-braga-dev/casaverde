<?php

namespace App\Services\Fatura;

use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ConcessionaireBillIssue;
use Illuminate\Support\Facades\DB;

class ValidateConcessionaireBillService
{
    public function handle(ConcessionaireBill $bill): array
    {
        return DB::transaction(function () use ($bill) {
            ConcessionaireBillIssue::query()
                ->where('concessionaire_bill_id', $bill->id)
                ->delete();

            $issues = [];

            $bill->load([
                'clientProfile.activeUsinaLink.usina',
                'clientProfile.activeDiscountRule',
            ]);

            if ($bill->parser_status === 'error') {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'parser_error',
                    'error',
                    'O parser automático falhou para esta fatura.'
                );
            }

            if ($bill->review_status === 'pending_review') {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'missing_review',
                    'warning',
                    'A fatura ainda não foi revisada.'
                );
            }

            if (!$bill->clientProfile?->is_active_client) {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'client_not_active',
                    'warning',
                    'O cadastro está vinculado a um prospect ou cliente ainda não ativo.'
                );
            }

            $activeUsinaLink = $bill->clientProfile?->activeUsinaLink;

            if (!$activeUsinaLink) {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'missing_active_usina',
                    'error',
                    'O cliente não possui vínculo ativo com usina.'
                );
            }

            if (!$bill->clientProfile?->activeDiscountRule) {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'missing_discount_rule',
                    'warning',
                    'O cliente não possui regra de desconto ativa.'
                );
            }

            if ((float) $bill->valor_total <= 0) {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'invalid_total_value',
                    'error',
                    'O valor total da fatura é inválido.'
                );
            }

            if ((float) ($bill->consumo_kwh ?? 0) <= 0) {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'invalid_consumption',
                    'warning',
                    'O consumo em kWh está ausente ou inválido.'
                );
            }

            $duplicateExists = ConcessionaireBill::query()
                ->where('id', '!=', $bill->id)
                ->where('client_profile_id', $bill->client_profile_id)
                ->where('unidade_consumidora', $bill->unidade_consumidora)
                ->where('reference_label', $bill->reference_label)
                ->exists();

            if ($duplicateExists) {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'duplicate_reference',
                    'error',
                    'Já existe outra fatura para este cliente, referência e unidade consumidora.'
                );
            }

            if ($bill->usina_id && $activeUsinaLink && (int) $bill->usina_id !== (int) $activeUsinaLink->usina_id) {
                $issues[] = $this->makeIssue(
                    $bill->id,
                    'unit_mismatch',
                    'warning',
                    'A usina informada na fatura não corresponde ao vínculo ativo do cliente.'
                );
            }

            foreach ($issues as $issue) {
                ConcessionaireBillIssue::create($issue);
            }

            return $issues;
        });
    }

    private function makeIssue(int $billId, string $code, string $severity, string $message): array
    {
        return [
            'concessionaire_bill_id' => $billId,
            'issue_code' => $code,
            'severity' => $severity,
            'message' => $message,
        ];
    }
}