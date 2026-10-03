<?php

namespace App\Http\Controllers\Auth\Propostas;

use App\Http\Controllers\Controller;
use App\Services\Proposta\TemporaryPdfStorageService;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ShowTemporaryPdfController extends Controller
{
    public function __invoke(string $arquivo, TemporaryPdfStorageService $storage): BinaryFileResponse
    {
        $path = $storage->path($arquivo);

        abort_unless(Storage::disk('local')->exists($path), 404);

        return response()->file(Storage::disk('local')->path($path), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="proposta.pdf"',
            'Cache-Control' => 'private, no-store',
        ]);
    }
}
