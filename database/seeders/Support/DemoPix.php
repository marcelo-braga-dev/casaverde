<?php

namespace Database\Seeders\Support;

/** Pix copia e cola fictício: recebedor e cidade deixam claro que não é cobrança real. */
final class DemoPix
{
    public static function copyPaste(int $id, float $amount): string
    {
        return '00020126580014br.gov.bcb.pix0136ficticio-'.$id.'-0000-0000-000000000000'
            .'5204000053039865406'.number_format($amount, 2, '.', '')
            .'5802BR5916EMPRESA FICTICIA6012DEMONSTRACAO62070503***6304DEMO';
    }
}
