<?php

namespace App\Http\Controllers\Auth\Cliente;

use App\Http\Controllers\Controller;
use App\Repositories\Cliente\ClienteRepository;

class GetClientesController extends Controller
{
    public function __invoke()
    {
        $registros = (new ClienteRepository)->getPaginate();

        return response()->json($registros);
    }
}
