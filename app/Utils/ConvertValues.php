<?php

namespace App\Utils;

class ConvertValues
{
    public static function moneyToFloat(?string $valor): float
    {
        if (is_null($valor) || $valor === '') {
            return 0;
        }

        if (is_numeric($valor)) {
            return $valor;
        }

        $valorLimpo = preg_replace('/[^\d,.-]/', '', $valor);
        $valorLimpo = str_replace('.', '', $valorLimpo);
        $valorLimpo = str_replace(',', '.', $valorLimpo);

        return is_numeric($valorLimpo) ? (float) $valorLimpo : 0.0;
    }

    public static function floatToMoney(?float $valor): string
    {
        return number_format($valor, 2, ',', '.');
    }
}
