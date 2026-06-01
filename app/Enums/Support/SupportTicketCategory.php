<?php

namespace App\Enums\Support;

enum SupportTicketCategory: string
{
    case Financeiro = 'financeiro';
    case Tecnico    = 'tecnico';
    case Comercial  = 'comercial';
    case Fatura     = 'fatura';
    case Usina      = 'usina';
    case Acesso     = 'acesso';
    case Contrato   = 'contrato';
    case Outros     = 'outros';

    public function label(): string
    {
        return match ($this) {
            self::Financeiro => 'Financeiro',
            self::Tecnico    => 'Técnico',
            self::Comercial  => 'Comercial',
            self::Fatura     => 'Fatura de Energia',
            self::Usina      => 'Usina Solar',
            self::Acesso     => 'Acesso / Login',
            self::Contrato   => 'Contrato',
            self::Outros     => 'Outros',
        };
    }

    public static function options(): array
    {
        return array_map(fn (self $c) => [
            'value' => $c->value,
            'label' => $c->label(),
        ], self::cases());
    }
}
