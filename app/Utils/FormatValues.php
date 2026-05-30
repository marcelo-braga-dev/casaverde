<?php

namespace App\Utils;

class FormatValues
{
    public static function formatCnpj($cnpj)
    {
        if (!is_numeric($cnpj)) return $cnpj;

        $cnpj = str_pad($cnpj, 14, '0', STR_PAD_LEFT);

        return preg_replace("/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/", "$1.$2.$3/$4-$5", $cnpj);
    }

    public static function formatCpf($cpf)
    {
        if (!is_numeric($cpf)) return $cpf;

        $cpf = str_pad($cpf, 11, '0', STR_PAD_LEFT);

        return preg_replace("/(\d{3})(\d{3})(\d{3})(\d{2})/", "$1.$2.$3-$4", $cpf);
    }


    public static function formatCep($cep)
    {
        if (!is_numeric($cep)) return $cep;

        $cep = str_pad($cep, 8, '0', STR_PAD_LEFT);

        return preg_replace("/(\d{5})(\d{3})/", "$1-$2", $cep);
    }

    public static function formatInteger($value)
    {
        return preg_replace('/\D/', '', $value);
    }

    public static function formatPhone($phone)
    {
        $phone = preg_replace('/\D/', '', $phone);

        if (strlen($phone) === 10) {
            return preg_replace('/(\d{2})(\d{4})(\d{4})/', '($1) $2-$3', $phone);
        } elseif (strlen($phone) === 11) {
            return preg_replace('/(\d{2})(\d{1})(\d{4})(\d{4})/', '($1) $2 $3-$4', $phone);
        }

        return $phone;
    }
}
