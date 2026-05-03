<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Http\Requests\Fatura\FilterConcessionaireBillRequest;
use App\Http\Requests\Fatura\StoreConcessionaireBillRequest;
use App\Http\Requests\Fatura\UpdateConcessionaireBillReviewRequest;
use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use App\Repositories\Fatura\ConcessionaireBillRepository;
use App\Services\Fatura\ReviewConcessionaireBillService;
use App\Services\Fatura\StoreParsedConcessionaireBillService;
use App\Services\Fatura\SuggestBillUsinaService;
use App\Services\Fatura\ValidateConcessionaireBillService;
use Inertia\Inertia;

class ConcessionaireBillController extends Controller
{
    public function index(
        FilterConcessionaireBillRequest $request,
        ConcessionaireBillRepository $repository
    ) {
        $filters = $request->validated();

        return Inertia::render('Consultor/Cliente/Fatura/Index/Page', [
            'bills' => $repository->paginate($filters, 20),
            'filters' => $filters,
            'reviewStatuses' => ['pending_review', 'reviewed', 'corrected', 'approved'],
            'parserStatuses' => ['pending', 'success', 'error'],
            'importSources' => ['manual', 'email'],
        ]);
    }

    public function create()
    {
        return Inertia::render('Consultor/Cliente/Fatura/Create/Page', [
            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),

            'usinas' => UsinaSolar::query()
                ->orderByDesc('id')
                ->get(['id', 'uc']),

            'clients' => ClientProfile::query()
                ->orderByDesc('id')
                ->get(['id', 'client_code', 'nome', 'razao_social', 'cpf', 'cnpj']),
        ]);
    }

    public function store(
        StoreConcessionaireBillRequest $request,
        StoreParsedConcessionaireBillService $service,
        ValidateConcessionaireBillService $validateService
    ) {
        $bill = $service->handle($request->validated());

        $validateService->handle($bill);

        return redirect()
            ->route('consultor.cliente.faturas.show', $bill->id)
            ->with('success', 'Fatura cadastrada com sucesso.');
    }

    public function show(
        ConcessionaireBill $fatura,
        SuggestBillUsinaService $suggestBillUsinaService
    ) {
        $fatura->load([
            'clientProfile',
            'clientProfile.activeUsinaLink.usina',
            'clientProfile.activeDiscountRule',
            'clientProfile.emailImportSetting.concessionaria',
            'concessionaria',
            'usina',
            'createdBy',
            'reviewedBy',
            'issues',
        ]);

        return Inertia::render('Consultor/Cliente/Fatura/Show/Page', [
            'bill' => $fatura,
            'emailImportSetting' => $fatura->clientProfile?->emailImportSetting,

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),

            'suggestedUsinaId' => $suggestBillUsinaService->handle($fatura),
            'reviewStatuses' => ['pending_review', 'reviewed', 'corrected', 'approved'],

            'usinas' => UsinaSolar::query()
                ->orderByDesc('id')
                ->get(['id', 'uc']),
        ]);
    }

    public function update(
        ConcessionaireBill $fatura,
        UpdateConcessionaireBillReviewRequest $request,
        ReviewConcessionaireBillService $service
    ) {
        $service->handle($fatura, $request->validated());

        return redirect()
            ->route('consultor.cliente.faturas.show', $fatura->id)
            ->setStatusCode(303)
            ->with('success', 'Fatura revisada com sucesso.');
    }
}
