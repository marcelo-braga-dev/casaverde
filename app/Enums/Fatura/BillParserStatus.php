<?php

namespace App\Enums\Fatura;

enum BillParserStatus: string
{
    case PENDING = 'pending';
    case SUCCESS = 'success';
    case ERROR = 'error';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pendente',
            self::SUCCESS => 'Sucesso',
            self::ERROR => 'Erro',
        };
    }
}
