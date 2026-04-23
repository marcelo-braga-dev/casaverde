<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\StoreConcessionariaRequest;
use App\Models\Usina\Concessionaria;
use App\Repositories\Usina\ConcessionariaRepository;
use Inertia\Inertia;

class ConcessionariaController extends Controller
{
    public function index(ConcessionariaRepository $repository)
    {
        return Inertia::render('Admin/Usina/Concessionaria/Index/Page', [
            'concessionarias' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Usina/Concessionaria/Create/Page');
    }

    public function store(StoreConcessionariaRequest $request)
    {
        $concessionaria = Concessionaria::create($request->validated());

        return redirect()
            ->route('admin.concessionarias.show', $concessionaria->id)
            ->with('success', 'Concessionária cadastrada com sucesso.');
    }

    public function show(Concessionaria $concessionaria)
    {
        return Inertia::render('Admin/Usina/Concessionaria/Show/Page', [
            'concessionaria' => $concessionaria,
        ]);
    }

    public function edit(Concessionaria $concessionaria)
    {
        return Inertia::render('Admin/Usina/Concessionaria/Edit/Page', [
            'concessionaria' => $concessionaria,
        ]);
    }

    public function update(StoreConcessionariaRequest $request, Concessionaria $concessionaria)
    {
        $concessionaria->update($request->validated());

        return redirect()
            ->route('admin.concessionarias.show', $concessionaria->id)
            ->with('success', 'Concessionária atualizada com sucesso.');
    }
}