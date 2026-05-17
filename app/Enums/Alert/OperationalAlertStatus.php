<?php

namespace App\Enums\Alert;

enum OperationalAlertStatus: string
{
    case Open = 'open';
    case InProgress = 'in_progress';
    case Resolved = 'resolved';
    case Ignored = 'ignored';

    public function label(): string
    {
        return match ($this) {
            self::Open => 'Aberto',
            self::InProgress => 'Em Tratamento',
            self::Resolved => 'Resolvido',
            self::Ignored => 'Ignorado',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Open => 'error',
            self::InProgress => 'warning',
            self::Resolved => 'success',
            self::Ignored => 'default',
        };
    }
}
