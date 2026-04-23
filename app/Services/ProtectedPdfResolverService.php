<?php

namespace App\Services\Fatura;

use RuntimeException;

class ProtectedPdfResolverService
{
    public function unlockToTempFile(string $absolutePdfPath, ?string $password = null): string
    {
        if (!is_file($absolutePdfPath)) {
            throw new RuntimeException('Arquivo PDF não encontrado.');
        }

        $tempOutput = storage_path('app/tmp/fatura-unlocked-' . uniqid() . '.pdf');

        if (!$password) {
            copy($absolutePdfPath, $tempOutput);
            return $tempOutput;
        }

        $command = sprintf(
            'qpdf --password=%s --decrypt %s %s 2>&1',
            escapeshellarg($password),
            escapeshellarg($absolutePdfPath),
            escapeshellarg($tempOutput)
        );

        exec($command, $output, $exitCode);

        if ($exitCode !== 0 || !is_file($tempOutput)) {
            throw new RuntimeException('Não foi possível desbloquear o PDF com a senha informada.');
        }

        return $tempOutput;
    }

    public function cleanup(?string $tempFile): void
    {
        if ($tempFile && is_file($tempFile)) {
            @unlink($tempFile);
        }
    }
}