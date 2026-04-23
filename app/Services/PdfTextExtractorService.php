<?php

namespace App\Services\Fatura;

use RuntimeException;

class PdfTextExtractorService
{
    public function extract(string $absolutePdfPath): string
    {
        if (!is_file($absolutePdfPath)) {
            throw new RuntimeException('Arquivo PDF não encontrado para leitura.');
        }

        $command = sprintf(
            'pdftotext -layout %s - 2>&1',
            escapeshellarg($absolutePdfPath)
        );

        exec($command, $output, $exitCode);

        if ($exitCode !== 0) {
            throw new RuntimeException('Falha ao extrair texto do PDF.');
        }

        $text = trim(implode("\n", $output));

        if ($text === '') {
            throw new RuntimeException('O PDF não retornou texto legível.');
        }

        return $text;
    }
}