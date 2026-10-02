<?php

namespace App\Support;

class DocumentValidator
{
    public static function isValid(?string $document): bool
    {
        $digits = DocumentNormalizer::clean($document) ?? '';

        return match (strlen($digits)) {
            11 => self::isValidCpf($digits),
            14 => self::isValidCnpj($digits),
            default => false,
        };
    }

    public static function isValidCpf(string $cpf): bool
    {
        if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        for ($t = 9; $t < 11; $t++) {
            $sum = 0;
            for ($i = 0; $i < $t; $i++) {
                $sum += (int) $cpf[$i] * (($t + 1) - $i);
            }

            if ((int) $cpf[$t] !== ((10 * $sum) % 11) % 10) {
                return false;
            }
        }

        return true;
    }

    public static function isValidCnpj(string $cnpj): bool
    {
        if (strlen($cnpj) !== 14 || preg_match('/^(\d)\1{13}$/', $cnpj)) {
            return false;
        }

        foreach ([12, 13] as $t) {
            $weights = $t === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            $sum = 0;
            for ($i = 0; $i < $t; $i++) {
                $sum += (int) $cnpj[$i] * $weights[$i];
            }

            $digit = $sum % 11 < 2 ? 0 : 11 - ($sum % 11);

            if ((int) $cnpj[$t] !== $digit) {
                return false;
            }
        }

        return true;
    }
}
