<?php

namespace App\Http\Controllers\Admin\Proposta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Proposta\StoreCommercialProposalRequest;
use App\Models\Proposta\CommercialProposal;
use App\Repositories\Proposta\CommercialProposalRepository;
use App\Services\Proposta\CreateCommercialProposalService;
use App\Services\Proposta\GenerateCommercialProposalPdfService;
use App\Models\Usina\Concessionaria;
use Inertia\Inertia;

class CommercialProposalController extends Controller
{
    public function index(CommercialProposalRepository $repository)
    {
        $this->authorize('viewAny', CommercialProposal::class);

        return Inertia::render('Consultor/Propostas/Cliente/Index/Page', [
            'proposals' => $repository->paginate(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', CommercialProposal::class);

        return Inertia::render('Consultor/Propostas/Cliente/Create/Page', [
            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome', 'estado']),
        ]);
    }

    public function store(
        StoreCommercialProposalRequest $request,
        CreateCommercialProposalService $service
    ) {
        $this->authorize('create', CommercialProposal::class);

        $result = $service->handle($request->validated());

        return redirect()
            ->route('consultor.propostas.cliente.show', $result['proposal']->id)
            ->with('success', 'Proposta emitida com sucesso.')
            ->with('client_already_exists', $result['client_already_exists'])
            ->with('client_message', $result['client_message']);
    }

    public function show(CommercialProposal $proposal)
    {
        $this->authorize('view', $proposal);

        return Inertia::render('Consultor/Propostas/Cliente/Show/Page', [
            'proposal' => $proposal->load(['clientProfile', 'consultor', 'concessionaria']),
        ]);
    }

    public function pdf(CommercialProposal $proposal, GenerateCommercialProposalPdfService $service)
    {
        $this->authorize('view', $proposal);

        return $service->stream($proposal);
    }
}
