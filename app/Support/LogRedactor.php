<?php

namespace App\Support;

// Logs não são protegidos como o banco (rotação, cópias, suporte): dados pessoais do
// pagador (LGPD) saem mascarados. O payload completo continua em payment_slips.
class LogRedactor
{
    private const SENSITIVE_KEYS = '/(cpf|cnpj|document|identification|number|email|phone|celular|telefone|street|address|zip|cep|rua|neighborhood|bairro|name|nome)/i';

    public static function redact(mixed $data): mixed
    {
        if (! is_array($data)) {
            return $data;
        }

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = self::redact($value);
            } elseif (is_string($key) && preg_match(self::SENSITIVE_KEYS, $key) && $value !== null && $value !== '') {
                $data[$key] = '***';
            }
        }

        return $data;
    }
}
