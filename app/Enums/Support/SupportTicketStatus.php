<?php

namespace App\Enums\Support;

enum SupportTicketStatus: string
{
    case Novo             = 'novo';
    case EmAtendimento    = 'em_atendimento';
    case AguardandoCliente = 'aguardando_cliente';
    case Resolvido        = 'resolvido';
    case Fechado          = 'fechado';
    case Cancelado        = 'cancelado';

    public function label(): string
    {
        return match ($this) {
            self::Novo              => 'Novo',
            self::EmAtendimento     => 'Em Atendimento',
            self::AguardandoCliente => 'Aguardando Cliente',
            self::Resolvido         => 'Resolvido',
            self::Fechado           => 'Fechado',
            self::Cancelado         => 'Cancelado',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Novo              => 'info',
            self::EmAtendimento     => 'warning',
            self::AguardandoCliente => 'secondary',
            self::Resolvido         => 'success',
            self::Fechado           => 'default',
            self::Cancelado         => 'error',
        };
    }

    public function isOpen(): bool
    {
        return in_array($this, [self::Novo, self::EmAtendimento, self::AguardandoCliente]);
    }

    public function isClosed(): bool
    {
        return in_array($this, [self::Resolvido, self::Fechado, self::Cancelado]);
    }

    /** Transições permitidas por status */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Novo              => [self::EmAtendimento, self::Cancelado],
            self::EmAtendimento     => [self::AguardandoCliente, self::Resolvido, self::Cancelado],
            self::AguardandoCliente => [self::EmAtendimento, self::Resolvido, self::Cancelado],
            self::Resolvido         => [self::Fechado, self::EmAtendimento],
            self::Fechado           => [],
            self::Cancelado         => [],
        };
    }

    public static function options(): array
    {
        return array_map(fn (self $s) => [
            'value' => $s->value,
            'label' => $s->label(),
            'color' => $s->color(),
        ], self::cases());
    }
}
