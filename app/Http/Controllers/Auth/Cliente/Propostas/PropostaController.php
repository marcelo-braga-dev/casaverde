<?php

namespace App\Http\Controllers\Auth\Cliente\Propostas;

use App\Http\Controllers\Controller;
use App\Repositories\Cliente\ClientePropostaRepository;
use App\Utils\AlertMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropostaController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Cliente/Proposta/Index/Page');
    }

    public function create()
    {
        return Inertia::render('Auth/Cliente/Proposta/Create/Page');
    }

    public function store(Request $request)
    {
        (new ClientePropostaRepository)->create($request);

        AlertMessage::success('Proposta cadastrado com sucesso.');

        return redirect()->route('auth.cliente.proposta.index');
    }

    public function show($id)
    {
        $idProposta = $id;

        return Inertia::render('Auth/Cliente/Proposta/Show/Page', compact('idProposta'));
    }
}
