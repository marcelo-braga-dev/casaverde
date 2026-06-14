<?php

namespace App\Http\Controllers\Auth\Propostas\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClienteProposta;

class GetDadosPropostaClienteController extends Controller
{
    public function __invoke($id)
    {
        $proposta = (new ClienteProposta)
            ->find($id);

        return response()->json($proposta);
    }
}
