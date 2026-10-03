<?php

namespace App\Http\Controllers\Auth\Propostas\Produtor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GerarPropostaUsinaController extends Controller
{
    public function gerarPdf(Request $request)
    {
        // Vai para o disco público, no mesmo domínio do CRM: um .html/.svg aqui viraria XSS.
        $request->validate([
            'file' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('pdfs', 'public');

            return response()->json(['url' => asset("storage/{$path}")]);
        }

        return response()->json(['error' => 'Nenhum arquivo recebido'], 400);
    }
}
