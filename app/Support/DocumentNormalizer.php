<?php

namespace App\Support;

class DocumentNormalizer
{
    public static function clean(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        return preg_replace('/\D+/', '', $value);
    }
}