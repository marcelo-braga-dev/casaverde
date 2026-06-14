<?php

namespace App\Enums\Support;

enum SupportTicketPriority: string
{
    case Baixa = 'baixa';
    case Normal = 'normal';
    case Alta = 'alta';
    case Urgente = 'urgente';

    public function label(): string
    {
        return match ($this) {
            self::Baixa => 'Baixa',
            self::Normal => 'Normal',
            self::Alta => 'Alta',
            self::Urgente => 'Urgente',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Baixa => 'default',
            self::Normal => 'info',
            self::Alta => 'warning',
            self::Urgente => 'error',
        };
    }

    public static function options(): array
    {
        return array_map(fn (self $p) => [
            'value' => $p->value,
            'label' => $p->label(),
            'color' => $p->color(),
        ], self::cases());
    }
}
