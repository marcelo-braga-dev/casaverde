<?php

namespace App\Http\Controllers\Contratos\Usina;

use App\Http\Controllers\Controller;
use App\Repositories\Produtor\ProdutorRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContratoUsinaController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Contratos/Usinas/Index/Page');
    }

    public function create(Request $request)
    {
        $produtor = (new ProdutorRepository)->findAllData($request->produtor);

        return Inertia::render('Admin/Contratos/Usinas/Create/Page', compact('produtor'));
    }
}
