<?php

namespace App\Services\Fatura;

use DomainException;

class CopelBillParserService
{
    public const INJECTED_ENERGY_PREFIXES = ['ENERGIA INJ. OUC MPT TE'];

    public const INJECTED_CONSUMPTION_PREFIXES = ['ENERGIA INJ. OUC MPT TE', 'ENERGIA INJ. OUC MPT TUS', 'ENERGIA INJ. BAND.'];

    public function parse(string $rawText): array
    {
        $text = $this->normalizeText($rawText);

        $nome = $this->extractFirstMatch($text, [
            '/Nome:\s*([^\n]+)/iu',
            '/^\s*([A-ZÀ-Ú][A-ZÀ-Ú\s]{5,})\s*$/mu',
        ]);

        $unidadeConsumidora = $this->extractFirstMatch($text, [
            '/UNIDADE\s+CONSUMIDORA\s*[:\-]?\s*([0-9\.\-\/]+)/iu',
            '/FAT-\d{2}-\d+\.\d+\s+([0-9]{6,10})\s+R?\$?[\d\.\,]+/iu',
            '/Endere(?:ç|c)o:\s*[^\n]*?\s+([0-9]{6,10})\s*$/imu',
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

        if (! $referencia || ! $vencimento || ! $valorTotal) {
            throw new DomainException('Não foi possível localizar os campos obrigatórios da fatura Copel.');
        }

        [$referenceMonth, $referenceYear] = explode('/', $referencia);

        $items = $this->parseItemLines($text);

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
            'injected_energy_kwh' => $this->sumItemsByPrefixes($items, self::INJECTED_ENERGY_PREFIXES, 'quantidade'),
            'injected_energy_amount' => $this->sumItemsByPrefixes($items, self::INJECTED_ENERGY_PREFIXES, 'valor'),
            'injected_consumption_kwh' => $this->sumItemsByPrefixes($items, self::INJECTED_CONSUMPTION_PREFIXES, 'quantidade'),
            'injected_consumption_amount' => $this->sumItemsByPrefixes($items, self::INJECTED_CONSUMPTION_PREFIXES, 'valor'),
            'items' => $items,
            'raw_text' => $text,
        ];
    }

    /**
     * Extrai as linhas da tabela "Itens da Fatura" (descrição, quantidade, valor).
     * O pdftotext -layout mistura essa tabela com blocos vizinhos (resumo de
     * impostos, histórico de consumo) na mesma linha; o regex ancora em "kWh"
     * e captura só os 3 números imediatamente seguintes (quantidade, tarifa
     * c/ tributos, valor), ignorando qualquer texto mesclado depois disso.
     */
    private function parseItemLines(string $text): array
    {
        $items = [];

        foreach (explode("\n", $text) as $line) {
            if (! preg_match(
                '/^\s*([A-ZÀ-ÚÇ][A-ZÀ-ÚÇ0-9.\/\s\-]*?)\s+kWh\s+(-?[\d.,]+)\s+(-?[\d.,]+)\s+(-?[\d.,]+)/u',
                $line,
                $matches
            )) {
                continue;
            }

            $items[] = [
                'descricao' => trim($matches[1]),
                'quantidade' => $this->parseBrazilianNumber($matches[2]),
                'valor' => $this->parseBrazilianNumber($matches[4]),
            ];
        }

        return $items;
    }

    private function sumItemsByPrefixes(array $items, array $prefixes, string $field): float
    {
        $sum = 0.0;

        foreach (self::filterByPrefixes($items, $prefixes) as $item) {
            $sum += $item[$field];
        }

        return round($sum, 2);
    }

    /**
     * Filtra os itens extraídos do PDF cuja descrição comece com um dos
     * prefixos informados. Usado também para exibir, na tela de conferência,
     * quais linhas compõem cada total calculado (energia/consumo injetado).
     */
    public static function filterByPrefixes(array $items, array $prefixes): array
    {
        return array_values(array_filter($items, function (array $item) use ($prefixes) {
            foreach ($prefixes as $prefix) {
                if (str_starts_with($item['descricao'], $prefix)) {
                    return true;
                }
            }

            return false;
        }));
    }

    private function parseBrazilianNumber(string $value): float
    {
        return (float) str_replace(',', '.', str_replace('.', '', $value));
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
