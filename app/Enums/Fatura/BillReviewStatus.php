<?php

namespace App\Enums\Fatura;

enum BillReviewStatus: string
{
    case PENDING_REVIEW = 'pending_review';
    case REVIEWED = 'reviewed';
    case CORRECTED = 'corrected';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING_REVIEW => 'Aguardando Revisão',
            self::REVIEWED => 'Revisada',
            self::CORRECTED => 'Corrigida',
            self::APPROVED => 'Aprovada',
            self::REJECTED => 'Rejeitada',
        };
    }
}
