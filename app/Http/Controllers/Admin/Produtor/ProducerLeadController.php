<?php

namespace App\Http\Controllers\Admin\Produtor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Produtor\StoreProducerLeadRequest;
use App\Models\Produtor\ProducerLead;
use App\Models\Produtor\ProducerProfile;
use App\Models\Usina\Concessionaria;
use App\Models\Users\User;
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
        $lead = ProducerLead::create($request->validated());

        return redirect()
            ->route('consultor.producer.leads.show', $lead->id)
            ->with('success', 'Lead de produtor cadastrado com sucesso.');
    }

    public function show(ProducerLead $producerLead)
    {
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
        $producerLead->update($request->validated());

        return redirect()
            ->route('consultor.producer.leads.show', $producerLead->id)
            ->with('success', 'Lead de produtor atualizado com sucesso.');
    }
}
