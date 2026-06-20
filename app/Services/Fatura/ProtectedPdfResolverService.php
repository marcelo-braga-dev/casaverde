<?php

namespace App\Services\Fatura;

use Illuminate\Support\Facades\File;
use RuntimeException;

class ProtectedPdfResolverService
{
    public function unlockToTempFile(string $absolutePdfPath, ?string $password = null): string
    {
        $password = $password !== null ? trim($password) : null;

        if (! is_file($absolutePdfPath)) {
            throw new RuntimeException('Arquivo PDF não encontrado.');
        }

        $tmpDir = storage_path('app/tmp');

        if (! File::exists($tmpDir)) {
            File::makeDirectory($tmpDir, 0775, true);
        }

        $tempOutput = $tmpDir.'/fatura-unlocked-'.uniqid('', true).'.pdf';

        if (! $password) {
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

        if ($exitCode !== 0 || ! is_file($tempOutput)) {
            $details = trim(implode("\n", $output));

            if (str_contains(strtolower($details), 'invalid password')) {
                throw new RuntimeException('Senha incorreta para desbloquear o PDF.');
            }

            throw new RuntimeException('Não foi possível desbloquear o PDF: '.($details !== '' ? $details : 'erro desconhecido do qpdf.'));
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
