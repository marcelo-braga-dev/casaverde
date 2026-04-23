<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\StoreUsinaSolarRequest;
use App\Models\Endereco\Address;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaBlock;
use App\Models\Usina\UsinaSolar;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Inertia\Inertia;

class UsinaSolarController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Usinas/Create/Page', [
            'produtores' => User::query()
                ->where('role_id', RoleUser::$PRODUTOR)
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'consultor_id']),
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'concessionarias' => Concessionaria::query()
                ->orderBy('nome')
                ->get(['id', 'nome']),
            'blocks' => UsinaBlock::query()
                ->orderBy('id')
                ->get(['id', 'nome']),
            'addresses' => Address::query()
                ->orderByDesc('id')
                ->get(['id', 'rua', 'numero', 'bairro', 'cidade', 'estado']),
        ]);
    }

    public function store(StoreUsinaSolarRequest $request)
    {
        $data = $request->validated();

        $usina = UsinaSolar::create($data);

        return redirect()
            ->route('admin.usinas.show', $usina->id)
            ->with('success', 'Usina cadastrada com sucesso.');
    }

    public function edit(UsinaSolar $usina)
    {
        return Inertia::render('Admin/Usinas/Edit/Page', [
            'usina' => $usina->load(['produtor', 'consultor', 'concessionaria', 'block', 'address']),
            'produtores' => User::query()
                ->where('role_id', RoleUser::$PRODUTOR)
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'consultor_id']),
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'concessionarias' => Concessionaria::query()
                ->orderBy('nome')
                ->get(['id', 'nome']),
            'blocks' => UsinaBlock::query()
                ->orderBy('id')
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