<?php

namespace App\Http\Controllers\Auth\Propostas\Produtor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProdutorPropostaController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Propostas/Produtor/index/Page');
    }
}
