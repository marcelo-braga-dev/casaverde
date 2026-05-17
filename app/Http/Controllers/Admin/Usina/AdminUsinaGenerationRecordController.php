<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\StoreUsinaGenerationRecordRequest;
use App\Models\Usina\UsinaGenerationRecord;
use App\Models\Usina\UsinaSolar;
use App\Services\Usina\UpsertUsinaGenerationRecordService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUsinaGenerationRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $usinaId = $request->integer('usina_id');

        $records = UsinaGenerationRecord::query()
            ->with(['usina.produtor'])
            ->when($usinaId, fn ($query) => $query->where('usina_id', $usinaId))
            ->orderByDesc('reference_year')
            ->orderByDesc('reference_month')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Usina/Generation/Index/Page', [
            'filters' => [
                'usina_id' => $usinaId,
            ],
            'records' => $records,
            'usinas' => UsinaSolar::query()
                ->with('produtor')
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Usina/Generation/Create/Page', [
            'usinas' => UsinaSolar::query()
                ->with('produtor')
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function store(
        StoreUsinaGenerationRecordRequest $request,
        UpsertUsinaGenerationRecordService $service
    ): RedirectResponse {
        $service->handle($request->validated());

        return redirect()
            ->route('admin.usinas.generation.index')
            ->with('success', 'Registro de geração salvo com sucesso.');
    }
}
