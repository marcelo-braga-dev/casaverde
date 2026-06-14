<?php

namespace App\Http\Controllers\Auth\Contratos\Clientes;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ClientesContratoController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Contratos/Clientes/Index/Page');
    }
}
