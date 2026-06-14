<?php

namespace App\Http\Controllers\Auth\Propostas\Produtor;

use App\Http\Controllers\Controller;
use App\Models\Produtor\ProdutorPropostas;

class GetDadosPropostaProdutorController extends Controller
{
    public function __invoke($id)
    {
        $proposta = (new ProdutorPropostas)
            ->find($id);

        return response()->json($proposta);
    }
}
