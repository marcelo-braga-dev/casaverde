<?php

namespace App\Http\Controllers\Admin\Proposta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Proposta\StoreCommercialProposalRequest;
use App\Http\Requests\Proposta\StoreProducerProposalRequest;
use App\Models\Endereco\Address;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Proposta\ProducerProposal;
use App\Models\Usina\Concessionaria;
use App\Repositories\Proposta\ProposalProducerRepository;
use App\Services\Proposta\CalculateProducerProposalInvestmentService;
use App\Services\Proposta\CreateProducerProposalService;
use App\Services\Proposta\GenerateCommercialProposalPdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProducerProposalController extends Controller
{
    public function index(ProposalProducerRepository $repository)
    {
        $filters = request()->only(['search', 'status']);

        return Inertia::render('Consultor/Propostas/Producer/Index/Page', [
            'proposals' => $repository->paginate(15, $filters),
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        // $this->authorize('create', CommercialProposal::class);

        $selectedProducer = null;

        if ($request->filled('producer_profile_id')) {
            $selectedProducer = ProducerProfile::query()
                ->find($request->integer('producer_profile_id'));
        }

        return Inertia::render('Consultor/Propostas/Producer/Create/Page', [
            'selectedProducer' => $selectedProducer,

            'producers' => ProducerProfile::query()
                ->orderByDesc('id')
                ->get([
                    'id',
                    'tipo_pessoa',
                    'cpf',
                    'cnpj',
                    'nome',
                    'razao_social',
                    'nome_fantasia',
                ]),

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome', 'estado']),
        ]);
    }

    public function store(
        StoreProducerProposalRequest $request,
        CreateProducerProposalService $service
    ) {
        // $this->authorize('create', CommercialProposal::class);

        $result = $service->handle($request->validated());

        return redirect()
            ->route('consultor.propostas.produtor.show', $result['proposal']->id)
            ->with('success', 'Proposta emitida com sucesso.')
            ->with('producer_already_exists', $result['producer_already_exists'])
            ->with('producer_message', $result['producer_message']);
    }

    public function show(ProducerProposal $proposal, CalculateProducerProposalInvestmentService $investmentService)
    {
        // $this->authorize('view', $proposal);

        $proposal->load([
            'producerProfile.activeFeeRule',
            'consultor',
            'concessionaria',
            'address',
        ]);

        return Inertia::render('Consultor/Propostas/Producer/Show/Page', [
            'proposal' => $proposal,
            'investmentSummary' => $investmentService->handle($proposal),
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

        if (! $hasAddress) {
            return null;
        }

        if ($proposal->address) {
            $proposal->address->update($addressData);

            return $proposal->address;
        }

        return Address::create($addressData);
    }
}
