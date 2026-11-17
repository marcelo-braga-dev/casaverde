<?php

namespace App\Http\Controllers\Admin\Proposta\Pdf;

use App\Http\Controllers\Controller;
use App\Services\Proposta\TemporaryPdfStorageService;
use Illuminate\Http\Request;

// Recebe o PDF da proposta montado no navegador e devolve uma URL temporária pública:
// o visualizador usado no celular (Google Viewer) só abre PDF por URL.
class ClientProposalPdfUploadController extends Controller
{
    public function __construct(private TemporaryPdfStorageService $pdfStorage) {}

    public function __invoke(Request $request)
    {
        $request->validate([
            'file' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        if ($request->hasFile('file')) {
            $url = $this->pdfStorage->store($request->file('file')->get());

            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'Nenhum arquivo recebido'], 400);
    }
}
