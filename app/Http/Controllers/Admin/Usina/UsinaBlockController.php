<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\StoreUsinaBlockRequest;
use App\Models\Usina\UsinaBlock;
use App\Repositories\Usina\UsinaBlockRepository;
use Inertia\Inertia;

class UsinaBlockController extends Controller
{
    public function index(UsinaBlockRepository $repository)
    {
        return Inertia::render('Consultor/Producer/Usina-Block/Index/Page', [
            'blocks' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Consultor/Producer/Usina-Block/Create/Page');
    }

    public function store(StoreUsinaBlockRequest $request)
    {
        $block = UsinaBlock::create($request->validated());

        return redirect()
            ->route('consultor.producer.usina-blocks.show', $block->id)
            ->with('success', 'Bloco cadastrado com sucesso.');
    }

    public function show(UsinaBlock $usinaBlock)
    {
        return Inertia::render('Consultor/Producer/Usina-Block/Show/Page', [
            'block' => $usinaBlock->load('usinas'),
        ]);
    }

    public function edit(UsinaBlock $usinaBlock)
    {
        return Inertia::render('Consultor/Producer/Usina-Block/Edit/Page', [
            'block' => $usinaBlock,
        ]);
    }

    public function update(StoreUsinaBlockRequest $request, UsinaBlock $usinaBlock)
    {
        $usinaBlock->update($request->validated());

        return redirect()
            ->route('consultor.producer.usina-blocks.show', $usinaBlock->id)
            ->with('success', 'Bloco atualizado com sucesso.');
    }
}
