<?php

namespace App\Support;

use Carbon\CarbonImmutable;

class BoletoDueDate
{
    // O fator de vencimento (posições 6–9 do código de barras) reiniciou em 1000 no
    // dia 22/02/2025 (Febraban), então a data real só é recuperável no ciclo atual.
    private const CYCLE_START = '2025-02-22';

    public static function fromBarcode(?string $barcode): ?CarbonImmutable
    {
        $digits = preg_replace('/\D+/', '', (string) $barcode);

        if (strlen($digits) !== 44) {
            return null;
        }

        $factor = (int) substr($digits, 5, 4);

        if ($factor < 1000) {
            return null;
        }

        return CarbonImmutable::parse(self::CYCLE_START)->addDays($factor - 1000);
    }
}
