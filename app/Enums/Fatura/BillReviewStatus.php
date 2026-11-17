<?php

namespace App\Enums\Fatura;

enum BillReviewStatus: string
{
    case PENDING_REVIEW = 'pending_review';
    // Legado (competências 05–07/2026): o fluxo atual vai direto de PENDING_REVIEW para APPROVED.
    case CORRECTED = 'corrected';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING_REVIEW => 'Aguardando Revisão',
            self::CORRECTED => 'Corrigida',
            self::APPROVED => 'Aprovada',
            self::REJECTED => 'Rejeitada',
        };
    }
}
