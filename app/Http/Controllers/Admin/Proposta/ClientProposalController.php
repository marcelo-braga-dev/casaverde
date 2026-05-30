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

class ClientProposalController extends Controller
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
                ]),

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome', 'estado']),
        ]);
    }

    public function store(
        StoreCommercialProposalRequest  $request,
        CreateCommercialProposalService $service
    )
    {
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

        $proposal->load([
            'consultor',
            // CLIENTE
            'clientProfile',
            'clientProfile.platformUser',
//            'clientProfile.user',
            'clientProfile.consultor',

            // ENDEREÇO
            'address',

            // USINA
//            'usina',
//            'usina.produtor',
//            'usina.concessionaria',

            // CONTRATO
//            'contract',

            // CONCESSIONÁRIA
            'concessionaria',

        ]);

        $cliente = $proposal->clientProfile;

        $dados = [
            'proposal' => $proposal,
            // PROPOSTA
            'id' => $proposal->id,

            'codigo' => (
                $proposal->proposal_code
                ?? ('PROP-' . $proposal->id)
            ),

            'status' => $proposal->status,

            'criado_em' => optional($proposal->created_at)->format('d/m/Y'),

            // VALORES
            'valor_medio' => (float)(
                $proposal->average_monthly_value
                ?? $proposal->valor_medio
                ?? 0
            ),

            'media_consumo' => (float)(
                $proposal->average_consumption_kwh
                ?? $proposal->media_consumo
                ?? 0
            ),

            'prazo_locacao' => (int)(
                $proposal->contract_term_months
                ?? $proposal->prazo_locacao
                ?? 0
            ),

            'taxa_reducao' => (float)(
                $proposal->discount_percentage
                ?? $proposal->taxa_reducao
                ?? 0
            ),

            'desconto_anual' => (
                    (
                    (float)(
                        $proposal->average_monthly_value
                        ?? $proposal->valor_medio
                        ?? 0
                    )
                    ) * (
                        (
                        (float)(
                            $proposal->discount_percentage
                            ?? $proposal->taxa_reducao
                            ?? 0
                        )
                        ) / 100
                    )
                ) * 12,

            // CLIENTE
            'cliente' => [
                'id' => $cliente?->id,
                'email' => (
                    $cliente?->email
                    ?? $cliente?->platformUser?->email
                ),
                'user_data' => [
                    'nome' => ($cliente?->nome),
                    'razao_social' => ($cliente?->razao_social),
                    'nome_fantasia' => ($cliente?->nome_fantasia),
                    'cpf' => ($cliente?->cpf),
                    'cnpj' => ($cliente?->cnpj),
                ],
                'contatos' => [
                    'celular' => (
                        $cliente?->telefone
                        ?? $cliente?->celular
                    ),
                    'email' => (
                        $cliente?->email
                        ?? $cliente?->platformUser?->email
                    ),
                ],
            ],

            // ENDEREÇO
            'endereco' => [
                'endereco_completo' => collect([
                    $proposal?->address?->rua,
                    $proposal?->address?->numero,
                    $proposal?->address?->bairro,
                    $proposal?->address?->cidade,
                    $proposal?->address?->estado,
                    $proposal?->address?->cep,
                ])
                    ->filter()
                    ->implode(', '),

            ],

            // USINA
            'usina' => [

                'id' => $proposal?->usina?->id,
                'uc' => $proposal?->usina?->uc,
                'potencia_usina' => ($proposal?->usina?->potencia_usina),
                'media_geracao' => ($proposal?->usina?->media_geracao),
            ],

            // CONCESSIONÁRIA
            'concessionaria' => [
                'nome' => ($proposal?->concessionaria?->nome),
            ],
        ];

        return Inertia::render(
            'Consultor/Propostas/Cliente/Show/Page',
            [
                'proposal' => $proposal,
                'dados' => $dados,
            ]
        );
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

    public
    function update(
        StoreCommercialProposalRequest $request,
        CommercialProposal             $proposal
    )
    {
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

    public
    function pdf(CommercialProposal $proposal, GenerateCommercialProposalPdfService $service)
    {
        $this->authorize('view', $proposal);

        return $service->stream($proposal);
    }

    private
    function createOrUpdateProposalAddress(CommercialProposal $proposal, array $addressData): ?Address
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
            ->map(fn($value) => $value === '' ? null : $value)
            ->toArray();

        $hasAddress = collect($addressData)
            ->filter(fn($value) => filled($value))
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
