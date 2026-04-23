<?php

namespace App\Services\Energia\Pdf;

use Carbon\Carbon;
use DomainException;

class EnergyBillPdfParserService
{
    public function parse(string $rawText): array
    {
        $text = $this->normalizeText($rawText);

        $unidadeConsumidora = $this->extractFirstMatch($text, [
            '/UNIDADE\s+CONSUMIDORA\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
            '/UC\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
        ]);

        $referencia = $this->extractFirstMatch($text, [
            '/(?:REFER[ÊE]NCIA|REF(?:ERENTE)?)[^\d]{0,15}((?:0[1-9]|1[0-2])\/\d{4})/iu',
            '/\b((?:0[1-9]|1[0-2])\/\d{4})\b/u',
        ]);

        $vencimentoRaw = $this->extractFirstMatch($text, [
            '/VENCIMENTO\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/iu',
            '/VENCTO\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/iu',
        ]);

        $totalPagarRaw = $this->extractFirstMatch($text, [
            '/TOTAL\s+A\s+PAGAR\s*[:\-]?\s*R?\$?\s*([\d\.\,]+)/iu',
            '/VALOR\s+TOTAL\s*[:\-]?\s*R?\$?\s*([\d\.\,]+)/iu',
        ]);

        $consumoRaw = $this->extractFirstMatch($text, [
            '/CONSUMO(?:\s+TOTAL)?\s*[:\-]?\s*([\d\.\,]+)\s*KWH/iu',
            '/([\d\.\,]+)\s*KWH/iu',
        ]);

        if (!$unidadeConsumidora || !$referencia || !$vencimentoRaw || !$totalPagarRaw) {
            throw new DomainException('Não foi possível localizar todos os campos obrigatórios no PDF.');
        }

        return [
            'unidade_consumidora' => preg_replace('/\D+/', '', $unidadeConsumidora),
            'referencia' => $this->normalizeReference($referencia),
            'vencimento' => $this->normalizeDate($vencimentoRaw),
            'total_pagar' => $this->normalizeDecimal($totalPagarRaw),
            'consumo_kwh' => $consumoRaw ? $this->normalizeDecimal($consumoRaw) : null,
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
        return Carbon::createFromFormat('d/m/Y', trim($value))->format('Y-m-d');
    }

    private function normalizeReference(string $value): string
    {
        if (preg_match('/(0[1-9]|1[0-2])\/(\d{4})/', $value, $matches)) {
            return $matches[1] . '/' . $matches[2];
        }

        throw new DomainException('Referência inválida encontrada no PDF.');
    }
}