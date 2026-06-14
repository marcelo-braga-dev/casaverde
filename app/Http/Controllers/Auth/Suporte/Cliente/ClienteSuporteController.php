<?php

namespace App\Http\Controllers\Auth\Suporte\Cliente;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ClienteSuporteController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Suporte/Clientes/Index/Page');
    }
}
