<?php

namespace App\Http\Controllers\Auth\Produtor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Produtor\StoreProdutorPropostaRequest;
use App\Repositories\Produtor\ProdutorPropostaRepository;
use App\Utils\AlertMessage;
use Inertia\Inertia;

class ProdutorPropostasController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Produtor/Proposta/Index/Page', []);
    }

    public function create()
    {
        return Inertia::render('Auth/Produtor/Proposta/Create/Page', []);
    }

    public function store(StoreProdutorPropostaRequest $request)
    {
        (new ProdutorPropostaRepository())->store($request->validated());

        AlertMessage::success('Proposta gerada com sucesso!');

        return redirect()->route('auth.produtor.proposta.index');
    }

    public function show($id)
    {
        $proposta = (new ProdutorPropostaRepository())->find((int) $id);

        abort_unless($proposta, 404);

        return Inertia::render('Auth/Produtor/Proposta/Show/Page', [
            'idProposta' => (int) $id,
        ]);
    }
}