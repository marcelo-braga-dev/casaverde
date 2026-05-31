<?php

namespace App\Enums\Cliente;

enum ContractStatus: string
{
    case ISSUED = 'issued';
    case SIGNED = 'signed';
    case ACTIVE = 'active';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::ISSUED => 'Emitido',
            self::SIGNED => 'Assinado',
            self::ACTIVE => 'Ativo',
            self::CANCELLED => 'Cancelado',
        };
    }
}
