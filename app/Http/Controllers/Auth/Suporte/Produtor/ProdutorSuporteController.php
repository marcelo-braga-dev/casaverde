<?php

namespace App\Http\Controllers\Auth\Suporte\Produtor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProdutorSuporteController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Suporte/Produtores/Index/Page');
    }
}
