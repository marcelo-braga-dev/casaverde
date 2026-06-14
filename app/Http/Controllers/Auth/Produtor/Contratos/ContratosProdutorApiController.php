<?php

namespace App\Http\Controllers\Auth\Produtor\Contratos;

use App\Http\Controllers\Controller;
use App\Repositories\Produtor\ProdutorContratoRepository;

class ContratosProdutorApiController extends Controller
{
    public function getAll($id)
    {
        $contratos = (new ProdutorContratoRepository)->getAll($id);

        return response()->json($contratos);
    }
}
