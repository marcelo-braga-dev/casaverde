<?php

namespace App\Http\Controllers\Auth\Cliente\Propostas;

use App\Http\Controllers\Controller;
use App\Repositories\Cliente\ClientePropostaRepository;

class GetClientePropostasController extends Controller
{
    public function __invoke($id)
    {
        $propostas = (new ClientePropostaRepository)->findCliente($id);

        return response()->json($propostas);
    }
}
