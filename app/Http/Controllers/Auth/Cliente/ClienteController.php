<?php

namespace App\Http\Controllers\Auth\Cliente;

use App\Http\Controllers\Controller;
use App\Repositories\Cliente\ClienteRepository;
use App\Repositories\Produtor\ProdutorRepository;
use App\Utils\AlertMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Cliente/Cliente/Index/Page');
    }

    public function create()
    {
        return Inertia::render('Auth/Cliente/Cliente/Create/Page');
    }

    public function show($id, Request $request)
    {
        $tab = $request->tab;

        $usuario = (new ProdutorRepository)->findAllData($id);

        return Inertia::render('Auth/Cliente/Cliente/Show/Page', compact('usuario', 'tab'));
    }

    public function store(Request $request)
    {
        try {
            (new ClienteRepository)->create($request);
        } catch (\DomainException $exception) {
            AlertMessage::error($exception->getMessage());

            return redirect()->back();
        }

        return redirect()->route('auth.cliente.index');
    }
}
