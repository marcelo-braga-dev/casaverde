<?php

namespace App\Http\Controllers\Auth\Propostas\Produtor;

use App\Http\Controllers\Controller;
use App\Services\Proposta\TemporaryPdfStorageService;
use Illuminate\Http\Request;

class GerarPropostaUsinaController extends Controller
{
    public function __construct(private TemporaryPdfStorageService $pdfStorage) {}

    public function gerarPdf(Request $request)
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
