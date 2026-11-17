<?php

namespace App\Enums\Cobranca;

enum CustomerChargeStatus: string
{
    case DRAFT = 'draft';
    case OPEN = 'open';
    case PAID = 'paid';
    case OVERDUE = 'overdue';
    case CANCELLED = 'cancelled';

    /** Encerrada: não muda mais de status nem recebe boleto. */
    public static function finalValues(): array
    {
        return [self::PAID->value, self::CANCELLED->value];
    }

    /** Em cobrança: aceita boleto/Pix e pode ser paga. */
    public static function payableValues(): array
    {
        return [self::OPEN->value, self::OVERDUE->value];
    }

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Rascunho',
            self::OPEN => 'Aberta',
            self::PAID => 'Paga',
            self::OVERDUE => 'Vencida',
            self::CANCELLED => 'Cancelada',
        };
    }
}
