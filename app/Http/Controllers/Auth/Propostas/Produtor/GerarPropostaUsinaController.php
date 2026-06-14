<?php

namespace App\Http\Controllers\Auth\Propostas\Produtor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GerarPropostaUsinaController extends Controller
{
    public function gerarPdf(Request $request)
    {
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('pdfs', 'public');

            return response()->json(['url' => asset("storage/{$path}")]);
        }

        return response()->json(['error' => 'Nenhum arquivo recebido'], 400);
    }
}
