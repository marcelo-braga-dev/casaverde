<?php

namespace App\Services\Proposta;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

// PDFs de proposta/contrato gerados só para visualização. Ficam fora do disco público
// (trazem dados pessoais do cliente) e são entregues por link assinado com validade.
class TemporaryPdfStorageService
{
    public const DIRECTORY = 'pdfs-temporarios';

    public const TTL_HOURS = 2;

    public function store(string $content): string
    {
        $id = (string) Str::uuid();

        Storage::disk('local')->put($this->path($id), $content);

        return URL::temporarySignedRoute(
            'pdfs.temporarios.show',
            now()->addHours(self::TTL_HOURS),
            ['arquivo' => $id],
        );
    }

    public function path(string $id): string
    {
        return self::DIRECTORY."/{$id}.pdf";
    }

    public function prune(): int
    {
        $disk = Storage::disk('local');
        $limit = now()->subDay()->getTimestamp();
        $deleted = 0;

        foreach ($disk->files(self::DIRECTORY) as $file) {
            if ($disk->lastModified($file) < $limit) {
                $disk->delete($file);
                $deleted++;
            }
        }

        return $deleted;
    }
}
