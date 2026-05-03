<?php

namespace App\Services\Fatura;

use DomainException;

class CopelBillParserService
{
    public function parse(string $rawText): array
    {
        $text = $this->normalizeText($rawText);

        $nome = $this->extractFirstMatch($text, [
            '/Nome:\s*([^\n]+)/iu',
            '/^\s*([A-ZÀ-Ú][A-ZÀ-Ú\s]{5,})\s*$/mu',
        ]);

        $unidadeConsumidora = $this->extractFirstMatch($text, [
            '/UNIDADE\s+CONSUMIDORA\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
            '/FAT-\d{2}-\d+\.\d+\s+([0-9]{8})\s+R?\$?[\d\.\,]+/iu',
            '/Endere(?:ç|c)o:\s*[^\n]*?\s+([0-9]{8})\s*$/imu',
            '/\bUC\s*[:\-]?\s*([0-9]{8})\b/iu',
        ]);

        $numeroInstalacao = $this->extractFirstMatch($text, [
            '/INSTALA(?:Ç|C)[ÃA]O\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
            '/\b([0-9]{10})\s+CONSUMO\s+kWh/iu',
        ]);

        $referencia = $this->extractFirstMatch($text, [
            '/REF(?:ER[ÊE]NCIA)?[\/\s\-:]*M[ÊE]S[\/\s\-:]*ANO\s*((?:0[1-9]|1[0-2])\/\d{4})/iu',
            '/(?:M[ÊE]S\s+DE\s+REFER[ÊE]NCIA|REFER[ÊE]NCIA|REF)\s*[:\-]?\s*((?:0[1-9]|1[0-2])\/\d{4})/iu',
            '/^\s*((?:0[1-9]|1[0-2])\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+R?\$?\s*[\d\.\,]+/mu',
        ]);

        $vencimento = $this->extractFirstMatch($text, [
            '/DATA\s+DE\s+VENCIMENTO\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/iu',
            '/VENCIMENTO\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/iu',
            '/^\s*(?:0[1-9]|1[0-2])\/\d{4}\s+(\d{2}\/\d{2}\/\d{4})\s+R?\$?\s*[\d\.\,]+/mu',
        ]);

        $valorTotal = $this->extractFirstMatch($text, [
            '/VALOR\s+COBRADO\s*[:\-]?\s*R?\$?\s*([\d\.\,]+)/iu',
            '/TOTAL\s+A\s+PAGAR\s*[:\-]?\s*R?\$?\s*([\d\.\,]+)/iu',
            '/VALOR\s+TOTAL\s*[:\-]?\s*R?\$?\s*([\d\.\,]+)/iu',
            '/^\s*(?:0[1-9]|1[0-2])\/\d{4}\s+\d{2}\/\d{2}\/\d{4}\s+R?\$?\s*([\d\.\,]+)/mu',
            '/TOTAL\s+([\d\.\,]+)\s+[\d\.\,]+\s+[\d\.\,]+/iu',
        ]);

        $consumoKwh = $this->extractFirstMatch($text, [
            '/CONSUMO\s+kWh\s+\w+\s+\d+\s+\d+\s+\d+\s+([\d\.\,]+)/iu',
            '/CONSUMO(?:\s+TOTAL)?\s*[:\-]?\s*([\d\.\,]+)\s*KWH/iu',
        ]);

        if (!$referencia || !$vencimento || !$valorTotal) {
            throw new DomainException('Não foi possível localizar os campos obrigatórios da fatura Copel.');
        }

        [$referenceMonth, $referenceYear] = explode('/', $referencia);

        return [
            'nome' => $nome ? trim($nome) : null,
            'reference_month' => (int) $referenceMonth,
            'reference_year' => (int) $referenceYear,
            'reference_label' => $referencia,
            'unidade_consumidora' => $unidadeConsumidora ? preg_replace('/\D+/', '', $unidadeConsumidora) : null,
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
        $text = preg_replace('/[ \t]+/u', ' ', $text);
        $text = preg_replace('/\n[ \t]+/u', "\n", $text);
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

        return round((float) $value, 2);
    }

    private function normalizeDate(string $value): string
    {
        [$day, $month, $year] = explode('/', $value);

        return sprintf('%04d-%02d-%02d', (int) $year, (int) $month, (int) $day);
    }
}
