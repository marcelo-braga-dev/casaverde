<?php

namespace App\Http\Controllers\Auth\Propostas\Cliente;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ClientePropostaController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Propostas/Cliente/index/Page');
    }
}
