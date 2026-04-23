<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\StoreUsinaSolarRequest;
use App\Models\Endereco\Address;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaBlock;
use App\Models\Usina\UsinaSolar;
use App\Models\Users\User;
use App\Repositories\Usina\UsinaSolarRepository;
use App\src\Roles\RoleUser;
use Inertia\Inertia;

class UsinaSolarController extends Controller
{
    public function index(UsinaSolarRepository $repository)
    {
        return Inertia::render('Admin/Usina/Index/Page', [
            'usinas' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Usina/Create/Page', [
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
            'blocks' => UsinaBlock::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
            'addresses' => Address::query()
                ->orderByDesc('id')
                ->get(['id', 'rua', 'numero', 'bairro', 'cidade', 'estado']),
        ]);
    }

    public function store(StoreUsinaSolarRequest $request)
    {
        $usina = UsinaSolar::create($request->validated());

        return redirect()
            ->route('admin.usinas.show', $usina->id)
            ->with('success', 'Usina cadastrada com sucesso.');
    }

    public function show(UsinaSolar $usina)
    {
        return Inertia::render('Admin/Usina/Show/Page', [
            'usina' => $usina->load([
                'user',
                'consultor',
                'concessionaria',
                'block',
                'address',
                'clientLinks.clientProfile',
            ]),
        ]);
    }

    public function edit(UsinaSolar $usina)
    {
        return Inertia::render('Admin/Usina/Edit/Page', [
            'usina' => $usina,
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
            'blocks' => UsinaBlock::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
            'addresses' => Address::query()
                ->orderByDesc('id')
                ->get(['id', 'rua', 'numero', 'bairro', 'cidade', 'estado']),
        ]);
    }

    public function update(StoreUsinaSolarRequest $request, UsinaSolar $usina)
    {
        $usina->update($request->validated());

        return redirect()
            ->route('admin.usinas.show', $usina->id)
            ->with('success', 'Usina atualizada com sucesso.');
    }
}