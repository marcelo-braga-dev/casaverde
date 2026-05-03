<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreClientContractRequest;
use App\Models\Cliente\ClientContract;
use App\Models\Proposta\CommercialProposal;
use App\Repositories\Cliente\ClientContractRepository;
use App\Services\Cliente\IssueClientContractService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientContractController extends Controller
{
    public function index(Request $request, ClientContractRepository $repository)
    {
        $filters = $request->only(['id', 'code', 'document']);

        return Inertia::render('Consultor/Cliente/Contract/Index/Page', [
            'contracts' => $repository->paginate($filters, 20),
            'filters' => $filters,
        ]);
    }

    public function create(CommercialProposal $proposal)
    {
        $proposal->load([
            'clientProfile',
            'clientProfile.platformUser.userData.address',
            'consultor',
            'concessionaria',
            'address',
            'contract',
        ]);

        return Inertia::render('Consultor/Cliente/Contract/Create/Page', [
            'proposal' => $proposal,
            'client' => $proposal->clientProfile,
            'existingContract' => $proposal->contract,
        ]);
    }

    public function store(
        StoreClientContractRequest $request,
        IssueClientContractService $service
    ) {
        $proposal = CommercialProposal::query()
            ->with(['clientProfile.platformUser.userData.address', 'address'])
            ->findOrFail($request->validated()['commercial_proposal_id']);

        $result = $service->handle($proposal, $request->validated());

        return redirect()
            ->route('consultor.cliente.contratos.show', $result['contract']->id)
            ->with('success', 'Contrato emitido com sucesso.')
            ->with('temporary_password', $result['temporary_password']);
    }

    public function show(ClientContract $contract)
    {
        return Inertia::render('Consultor/Cliente/Contract/Show/Page', [
            'contract' => $contract->load([
                'clientProfile',
                'user.userData.address',
                'proposal.concessionaria',
                'proposal.address',
            ]),
        ]);
    }

    public function edit(ClientContract $contract)
    {
        return Inertia::render('Consultor/Cliente/Contract/Edit/Page', [
            'contract' => $contract->load([
                'clientProfile',
                'user.userData.address',
                'proposal.concessionaria',
                'proposal.address',
            ]),
        ]);
    }

    public function update(
        StoreClientContractRequest $request,
        ClientContract $contract,
        IssueClientContractService $service
    ) {
        $proposal = $contract->proposal()
            ->with(['clientProfile.platformUser.userData.address', 'address'])
            ->firstOrFail();

        $service->handle($proposal, $request->validated());

        return redirect()
            ->route('consultor.cliente.contratos.show', $contract->id)
            ->with('success', 'Contrato atualizado com sucesso.');
    }
}
