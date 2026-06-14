<?php

namespace App\Http\Controllers\Auth\Produtor;

use App\Http\Controllers\Controller;
use App\Repositories\Produtor\ProdutorRepository;
use App\Utils\AlertMessage;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProdutorController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Produtor/Index/Page');
    }

    public function create()
    {
        return Inertia::render('Auth/Produtor/Create/Page');
    }

    public function store(Request $request)
    {
        $request->merge([
            'cpf' => isset($request->cpf) ? preg_replace('/\D/', '', $request->cpf) : null,
            'cnpj' => isset($request->cnpj) ? preg_replace('/\D/', '', $request->cnpj) : null,
        ]);

        try {
            $request->validate([
                'email' => 'required|email|unique:users,email',
                'cpf' => 'nullable|unique:user_data,cpf',
                'cnpj' => 'nullable|unique:user_data,cnpj',
            ], [
                'email.unique' => 'Este e-mail já está cadastrado.',
                'cpf.unique' => 'Este CPF já está cadastrado.',
                'cnpj.unique' => 'Este CNPJ já está cadastrado.',
            ]);

        } catch (ValidationException $exception) {
            AlertMessage::error($exception->getMessage());

            return redirect()->back();
        }

        try {
            $userId = (new ProdutorRepository)->create($request);

            AlertMessage::success('Cadastrado com sucesso!');

            return redirect()->route('auth.produtor.show', [$userId, 'tab' => 'propostas']);
        } catch (\Exception $exception) {
            AlertMessage::error($exception->getMessage());

            return redirect()->back();
        }
    }

    public function show($id, Request $request)
    {
        $tab = $request->tab;

        $usuario = (new ProdutorRepository)->findAllData($id);

        return Inertia::render('Auth/Produtor/Show/Page', compact('usuario', 'tab'));
    }
}
