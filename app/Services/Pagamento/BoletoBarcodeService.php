<?php

namespace App\Services\Pagamento;

use InvalidArgumentException;
use Picqer\Barcode\BarcodeGeneratorPNG;

class BoletoBarcodeService
{
    // Febraban exige código de barras de boleto com exatamente 44 dígitos numéricos.
    private const BARCODE_LENGTH = 44;

    public function barcodeImageBase64(string $barcode): string
    {
        $digits = $this->onlyDigits($barcode);

        if (strlen($digits) !== self::BARCODE_LENGTH) {
            throw new InvalidArgumentException(
                "Código de barras de boleto inválido: esperado {$this->digitsLabel()}, recebido ".strlen($digits).' dígitos.'
            );
        }

        $generator = new BarcodeGeneratorPNG;

        $png = $generator->getBarcode(
            $digits,
            BarcodeGeneratorPNG::TYPE_INTERLEAVED_2_5,
            widthFactor: 2,
            height: 60,
        );

        return 'data:image/png;base64,'.base64_encode($this->toTruecolorPng($png));
    }

    // dompdf falha silenciosamente ao renderizar o PNG paletizado (1-bit) gerado pelo
    // picqer — a imagem some, sobrando só o texto alternativo. Reconvertendo para
    // truecolor garante compatibilidade.
    private function toTruecolorPng(string $png): string
    {
        $source = imagecreatefromstring($png);
        $width = imagesx($source);
        $height = imagesy($source);

        $truecolor = imagecreatetruecolor($width, $height);
        $white = imagecolorallocate($truecolor, 255, 255, 255);
        imagefill($truecolor, 0, 0, $white);
        imagecopy($truecolor, $source, 0, 0, 0, 0, $width, $height);

        ob_start();
        imagepng($truecolor);
        $output = ob_get_clean();

        imagedestroy($source);
        imagedestroy($truecolor);

        return $output;
    }

    public function formatDigitableLine(string $digitableLine): string
    {
        $digits = $this->onlyDigits($digitableLine);

        if (strlen($digits) !== 47) {
            // Já veio formatada de forma diferente do padrão (ou de outro provider) —
            // devolve como recebida em vez de arriscar uma formatação incorreta.
            return $digitableLine;
        }

        $blocks = [
            substr($digits, 0, 5).'.'.substr($digits, 5, 5),
            substr($digits, 10, 5).'.'.substr($digits, 15, 6),
            substr($digits, 21, 5).'.'.substr($digits, 26, 6),
            substr($digits, 32, 1),
            substr($digits, 33, 14),
        ];

        return implode('  ', $blocks);
    }

    private function onlyDigits(string $value): string
    {
        return preg_replace('/\D+/', '', $value) ?? '';
    }

    private function digitsLabel(): string
    {
        return self::BARCODE_LENGTH.' dígitos';
    }
}
