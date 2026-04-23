<?php

namespace App\Services\Energia\Pdf;

use RuntimeException;

class ProtectedPdfTextExtractorService
{
    public function extractTextFromPdf(string $pdfAbsolutePath, ?string $password = null): string
    {
        if (!is_file($pdfAbsolutePath)) {
            throw new RuntimeException('PDF não encontrado para extração.');
        }

        $tempDir = storage_path('app/tmp/energy-bill-import');
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0775, true);
        }

        $decryptedPath = $tempDir . '/' . uniqid('decrypted_', true) . '.pdf';

        try {
            if ($password) {
                $this->decryptPdf($pdfAbsolutePath, $decryptedPath, $password);
                $targetPath = $decryptedPath;
            } else {
                $targetPath = $pdfAbsolutePath;
            }

            $text = $this->extractTextWithPdftotext($targetPath);

            $text = trim($text);
            if ($text === '') {
                throw new RuntimeException('Não foi possível extrair texto do PDF.');
            }

            return $text;
        } finally {
            if (is_file($decryptedPath)) {
                @unlink($decryptedPath);
            }
        }
    }

    private function decryptPdf(string $inputPath, string $outputPath, string $password): void
    {
        $command = sprintf(
            'qpdf --password=%s --decrypt %s %s 2>&1',
            escapeshellarg($password),
            escapeshellarg($inputPath),
            escapeshellarg($outputPath),
        );

        exec($command, $output, $exitCode);

        if ($exitCode !== 0 || !is_file($outputPath)) {
            throw new RuntimeException(
                'Falha ao desbloquear PDF com qpdf: ' . implode("\n", $output)
            );
        }
    }

    private function extractTextWithPdftotext(string $pdfPath): string
    {
        $command = sprintf(
            'pdftotext -layout %s - 2>&1',
            escapeshellarg($pdfPath)
        );

        exec($command, $output, $exitCode);

        if ($exitCode !== 0) {
            throw new RuntimeException(
                'Falha ao extrair texto com pdftotext: ' . implode("\n", $output)
            );
        }

        return implode("\n", $output);
    }
}