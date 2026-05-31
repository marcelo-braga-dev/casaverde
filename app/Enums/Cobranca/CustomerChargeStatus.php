<?php

namespace App\Enums\Cobranca;

enum CustomerChargeStatus: string
{
    case DRAFT = 'draft';
    case OPEN = 'open';
    case WAITING_PAYMENT = 'waiting_payment';
    case PAID = 'paid';
    case OVERDUE = 'overdue';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Rascunho',
            self::OPEN => 'Aberta',
            self::WAITING_PAYMENT => 'Aguardando Pagamento',
            self::PAID => 'Paga',
            self::OVERDUE => 'Vencida',
            self::CANCELLED => 'Cancelada',
        };
    }
}
