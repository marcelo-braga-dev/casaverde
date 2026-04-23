<?php

namespace App\Support;

class EmailNormalizer
{
    public static function clean(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        return mb_strtolower(trim($value));
    }
}