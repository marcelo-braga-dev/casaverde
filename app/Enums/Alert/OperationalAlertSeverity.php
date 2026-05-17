<?php

namespace App\Enums\Alert;

enum OperationalAlertSeverity: string
{
    case Info = 'info';
    case Warning = 'warning';
    case Error = 'error';
    case Critical = 'critical';

    public function label(): string
    {
        return match ($this) {
            self::Info => 'Informativo',
            self::Warning => 'Atenção',
            self::Error => 'Erro',
            self::Critical => 'Crítico',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Info => 'info',
            self::Warning => 'warning',
            self::Error => 'error',
            self::Critical => 'error',
        };
    }
}
