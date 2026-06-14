<?php

namespace App\Http\Controllers\Auth\Produtor;

use App\Http\Controllers\Controller;
use App\Repositories\Produtor\ProdutorPropostaRepository;

class PropostasProdutorController extends Controller
{
    public function __invoke()
    {
        $registros = (new ProdutorPropostaRepository)->getAll();

        return response()->json($registros);
    }
}
