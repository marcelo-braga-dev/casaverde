<?php

namespace App\Http\Controllers\Admin\Produtor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Produtor\StoreProducerLeadRequest;
use App\Models\Produtor\ProducerLead;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Repositories\Produtor\ProducerLeadRepository;
use App\src\Roles\RoleUser;
use Inertia\Inertia;

/**
 * @deprecated
 */
class ProducerLeadController extends Controller
{
    public function index(ProducerLeadRepository $repository)
    {
        return Inertia::render('Consultor/Producer/Lead/Index/Page', [
            'leads' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Consultor/Producer/Lead/Create/Page', [
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
        ]);
    }

    public function store(StoreProducerLeadRequest $request)
    {
        $data = $request->validated();

        // Consultor só cria lead na própria carteira.
        if (auth()->user()->isConsultor()) {
            $data['consultor_user_id'] = auth()->id();
        }

        $lead = ProducerLead::create($data);

        return redirect()
            ->route('consultor.producer.leads.show', $lead->id)
            ->with('success', 'Lead de produtor cadastrado com sucesso.');
    }

    public function show(ProducerLead $producerLead)
    {
        $this->ensureOwnLead($producerLead);

        return Inertia::render('Consultor/Producer/Lead/Show/Page', [
            'lead' => $producerLead->load([
                'consultor',
                'producerProfile.consultor',
                'producerProfile.contacts',
                'concessionaria',
            ]),
        ]);
    }

    public function edit(ProducerLead $producerLead)
    {
        $this->ensureOwnLead($producerLead);

        return Inertia::render('Consultor/Producer/Lead/Edit/Page', [
            'lead' => $producerLead->load([
                'consultor',
                'producerProfile.consultor',
                'producerProfile.contacts',
                'concessionaria',
            ]),
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'producerProfiles' => ProducerProfile::query()
                ->with(['consultor', 'contacts'])
                ->orderByDesc('id')
                ->get(['id', 'tipo_pessoa', 'nome', 'razao_social', 'nome_fantasia', 'consultor_user_id', 'contacts_id']),
            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
        ]);
    }

    public function update(StoreProducerLeadRequest $request, ProducerLead $producerLead)
    {
        $this->ensureOwnLead($producerLead);

        $producerLead->update($request->validated());

        return redirect()
            ->route('consultor.producer.leads.show', $producerLead->id)
            ->with('success', 'Lead de produtor atualizado com sucesso.');
    }

    private function ensureOwnLead(ProducerLead $producerLead): void
    {
        $user = auth()->user();

        abort_if($user->isConsultor() && (int) $producerLead->consultor_user_id !== (int) $user->id, 403);
    }
}
