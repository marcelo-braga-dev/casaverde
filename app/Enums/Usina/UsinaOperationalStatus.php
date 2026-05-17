<?php

namespace App\Enums\Usina;

enum UsinaOperationalStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Maintenance = 'maintenance';
    case PendingDocumentation = 'pending_documentation';
    case Blocked = 'blocked';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Ativa',
            self::Inactive => 'Inativa',
            self::Maintenance => 'Em Manutenção',
            self::PendingDocumentation => 'Documentação Pendente',
            self::Blocked => 'Bloqueada',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Active => 'success',
            self::Inactive => 'default',
            self::Maintenance => 'warning',
            self::PendingDocumentation => 'info',
            self::Blocked => 'error',
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
