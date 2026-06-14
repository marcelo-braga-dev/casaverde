<?php

namespace App\Http\Controllers\Auth\Produtor\Contratos;

use App\Http\Controllers\Controller;
use App\Repositories\Produtor\ProdutorContratoRepository;
use App\Repositories\Produtor\ProdutorRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContratosProdutorController extends Controller
{
    public function create(Request $request)
    {
        $produtorId = $request->get('userId');

        $contratante = (new ProdutorRepository)->findAllData($produtorId);

        return Inertia::render('Auth/Produtor/Contrato/Create/Page', compact('contratante'));
    }

    public function store(Request $request)
    {
        try {
            $contratoId = (new ProdutorContratoRepository)->story($request->all());

            return redirect()->route('auth.produtor-contratos.show', $contratoId);
        } catch (\Exception) {
            return redirect()->back();
        }
    }

    public function show($id)
    {
        $contratoId = $id;

        return Inertia::render('Auth/Produtor/Contrato/Show/Page', compact('contratoId'));
    }
}
