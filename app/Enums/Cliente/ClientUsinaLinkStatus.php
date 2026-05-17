<?php

namespace App\Enums\Cliente;

enum ClientUsinaLinkStatus: string
{
    case Active = 'active';
    case Scheduled = 'scheduled';
    case Inactive = 'inactive';
    case Finished = 'finished';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Ativo',
            self::Scheduled => 'Agendado',
            self::Inactive => 'Inativo',
            self::Finished => 'Finalizado',
            self::Cancelled => 'Cancelado',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Active => 'success',
            self::Scheduled => 'info',
            self::Inactive => 'default',
            self::Finished => 'secondary',
            self::Cancelled => 'error',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn (self $status) => [
                'value' => $status->value,
                'label' => $status->label(),
                'color' => $status->color(),
            ],
            self::cases()
        );
    }
}
