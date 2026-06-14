<?php

namespace App\Http\Controllers\Auth\Cliente\Propostas;

use App\Http\Controllers\Controller;
use App\Repositories\Cliente\ClientePropostaRepository;

class GetPropostaController extends Controller
{
    public function __invoke()
    {
        $registros = (new ClientePropostaRepository)->get();

        return response()->json($registros);
    }
}
