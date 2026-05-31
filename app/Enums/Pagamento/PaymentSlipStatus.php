<?php

namespace App\Enums\Pagamento;

enum PaymentSlipStatus: string
{
    case PENDING = 'pending';
    case GENERATED = 'generated';
    case PAID = 'paid';
    case CANCELLED = 'cancelled';
    case EXPIRED = 'expired';
    case FAILED = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pendente',
            self::GENERATED => 'Gerado',
            self::PAID => 'Pago',
            self::CANCELLED => 'Cancelado',
            self::EXPIRED => 'Expirado',
            self::FAILED => 'Falhou',
        };
    }
}
