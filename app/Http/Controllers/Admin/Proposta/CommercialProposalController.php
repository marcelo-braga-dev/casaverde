<?php

namespace App\Http\Controllers\Admin\Proposta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Proposta\StoreCommercialProposalRequest;
use App\Models\Cliente\ClientProfile;
use App\Models\Endereco\Address;
use App\Models\Proposta\CommercialProposal;
use App\Models\Usina\Concessionaria;
use App\Repositories\Proposta\CommercialProposalRepository;
use App\Services\Proposta\CreateCommercialProposalService;
use App\Services\Proposta\GenerateCommercialProposalPdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function create(Request $request)
    {
        $this->authorize('create', CommercialProposal::class);

        $selectedClient = null;

        if ($request->filled('client_profile_id')) {
            $selectedClient = ClientProfile::query()
                ->find($request->integer('client_profile_id'));
        }

        return Inertia::render('Consultor/Propostas/Cliente/Create/Page', [
            'selectedClient' => $selectedClient,

            'clients' => ClientProfile::query()
                ->orderByDesc('id')
                ->get([
                    'id',
                    'client_code',
                    'tipo_pessoa',
                    'cpf',
                    'cnpj',
                    'nome',
                    'razao_social',
                    'nome_fantasia',
                    'email',
                    'telefone',
                ]),

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
            'proposal' => $proposal->load([
                'clientProfile',
                'consultor',
                'concessionaria',
                'address',
            ]),
        ]);
    }

    public function edit(CommercialProposal $proposal)
    {
        $this->authorize('update', $proposal);

        return Inertia::render('Consultor/Propostas/Cliente/Edit/Page', [
            'proposal' => $proposal->load([
                'clientProfile',
                'consultor',
                'concessionaria',
                'address',
            ]),

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome', 'estado']),
        ]);
    }

    public function update(
        StoreCommercialProposalRequest $request,
        CommercialProposal $proposal
    ) {
        $this->authorize('update', $proposal);

        $data = $request->validated();

        DB::transaction(function () use ($proposal, $data) {
            $proposal->clientProfile?->update([
                'tipo_pessoa' => $data['tipo_pessoa'],
                'cpf' => $data['cpf'] ?? null,
                'cnpj' => $data['cnpj'] ?? null,
                'nome' => $data['nome'] ?? null,
                'razao_social' => $data['razao_social'] ?? null,
                'nome_fantasia' => $data['nome_fantasia'] ?? null,
                'email' => $data['email'] ?? null,
                'telefone' => $data['telefone'] ?? null,
            ]);

            $address = $this->createOrUpdateProposalAddress(
                $proposal,
                $data['address'] ?? []
            );

            $proposal->update([
                'concessionaria_id' => $data['concessionaria_id'],
                'address_id' => $address?->id,
                'media_consumo' => $data['media_consumo'] ?? null,
                'taxa_reducao' => $data['taxa_reducao'] ?? null,
                'prazo_locacao' => $data['prazo_locacao'] ?? null,
                'valor_medio' => $data['valor_medio'] ?? null,
                'unidade_consumidora' => $data['unidade_consumidora'] ?? null,
                'valid_until' => $data['valid_until'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);
        });

        return redirect()
            ->route('consultor.propostas.cliente.show', $proposal->id)
            ->with('success', 'Proposta atualizada com sucesso.');
    }

    public function pdf(CommercialProposal $proposal, GenerateCommercialProposalPdfService $service)
    {
        $this->authorize('view', $proposal);

        return $service->stream($proposal);
    }

    private function createOrUpdateProposalAddress(CommercialProposal $proposal, array $addressData): ?Address
    {
        $addressData = collect($addressData)
            ->only([
                'cep',
                'rua',
                'numero',
                'complemento',
                'bairro',
                'cidade',
                'estado',
                'referencia',
                'latitude',
                'longitude',
            ])
            ->map(fn ($value) => $value === '' ? null : $value)
            ->toArray();

        $hasAddress = collect($addressData)
            ->filter(fn ($value) => filled($value))
            ->isNotEmpty();

        if (!$hasAddress) {
            return null;
        }

        if ($proposal->address) {
            $proposal->address->update($addressData);

            return $proposal->address;
        }

        return Address::create($addressData);
    }
}
