<?php

namespace App\Services\Fatura;

use DomainException;

class CopelBillParserService
{
    public function parse(string $rawText): array
    {
        $text = $this->normalizeText($rawText);

        $unidadeConsumidora = $this->extractFirstMatch($text, [
            '/UNIDADE\s+CONSUMIDORA\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
            '/UC\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
        ]);

        $numeroInstalacao = $this->extractFirstMatch($text, [
            '/INSTALA(?:Ç|C)[ÃA]O\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
            '/N[ÚU]MERO\s+DA\s+INSTALA(?:Ç|C)[ÃA]O\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
        ]);

        $referencia = $this->extractFirstMatch($text, [
            '/(?:M[ÊE]S\s+DE\s+REFER[ÊE]NCIA|REFER[ÊE]NCIA|REF)\s*[:\-]?\s*((?:0[1-9]|1[0-2])\/\d{4})/iu',
            '/\b((?:0[1-9]|1[0-2])\/\d{4})\b/u',
        ]);

        $vencimento = $this->extractFirstMatch($text, [
            '/VENCIMENTO\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/iu',
            '/DATA\s+DE\s+VENCIMENTO\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/iu',
        ]);

        $valorTotal = $this->extractFirstMatch($text, [
            '/TOTAL\s+A\s+PAGAR\s*[:\-]?\s*R?\$?\s*([\d\.\,]+)/iu',
            '/VALOR\s+TOTAL\s*[:\-]?\s*R?\$?\s*([\d\.\,]+)/iu',
        ]);

        $consumoKwh = $this->extractFirstMatch($text, [
            '/CONSUMO(?:\s+TOTAL)?\s*[:\-]?\s*([\d\.\,]+)\s*KWH/iu',
            '/([\d\.\,]+)\s*KWH/iu',
        ]);

        if (!$unidadeConsumidora || !$referencia || !$vencimento || !$valorTotal) {
            throw new DomainException('Não foi possível localizar os campos obrigatórios da fatura Copel.');
        }

        [$referenceMonth, $referenceYear] = explode('/', $referencia);

        return [
            'reference_month' => (int) $referenceMonth,
            'reference_year' => (int) $referenceYear,
            'reference_label' => $referencia,
            'unidade_consumidora' => preg_replace('/\D+/', '', $unidadeConsumidora),
            'numero_instalacao' => $numeroInstalacao ? preg_replace('/\D+/', '', $numeroInstalacao) : null,
            'vencimento' => $this->normalizeDate($vencimento),
            'valor_total' => $this->normalizeDecimal($valorTotal),
            'consumo_kwh' => $consumoKwh ? $this->normalizeDecimal($consumoKwh) : null,
            'raw_text' => $text,
        ];
    }

    private function normalizeText(string $text): string
    {
        $text = str_replace("\r", "\n", $text);
        $text = preg_replace("/[ \t]+/u", ' ', $text);
        $text = preg_replace("/\n{2,}/u", "\n", $text);

        return trim($text);
    }

    private function extractFirstMatch(string $text, array $patterns): ?string
    {
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                return trim($matches[1]);
            }
        }

        return null;
    }

    private function normalizeDecimal(string $value): float
    {
        $value = preg_replace('/[^\d,\.]/', '', $value) ?? '0';

        if (str_contains($value, ',') && str_contains($value, '.')) {
            $value = str_replace('.', '', $value);
            $value = str_replace(',', '.', $value);
        } elseif (str_contains($value, ',')) {
            $value = str_replace(',', '.', $value);
        }

        return (float) $value;
    }

    private function normalizeDate(string $value): string
    {
        [$day, $month, $year] = explode('/', $value);

        return sprintf('%04d-%02d-%02d', (int) $year, (int) $month, (int) $day);
    }
}