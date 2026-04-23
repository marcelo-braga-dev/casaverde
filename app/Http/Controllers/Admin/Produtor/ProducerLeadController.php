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

class ProducerLeadController extends Controller
{
    public function index(ProducerLeadRepository $repository)
    {
        return Inertia::render('Admin/Produtor/Lead/Index/Page', [
            'leads' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Produtor/Lead/Create/Page', [
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'producerProfiles' => ProducerProfile::query()
                ->orderByDesc('id')
                ->get(['id', 'usina_nome', 'admin_nome']),
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
            ->route('admin.producer-leads.show', $lead->id)
            ->with('success', 'Lead de produtor cadastrado com sucesso.');
    }

    public function show(ProducerLead $producerLead)
    {
        return Inertia::render('Admin/Produtor/Lead/Show/Page', [
            'lead' => $producerLead->load(['consultor', 'producerProfile', 'concessionaria']),
        ]);
    }

    public function edit(ProducerLead $producerLead)
    {
        return Inertia::render('Admin/Produtor/Lead/Edit/Page', [
            'lead' => $producerLead,
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'producerProfiles' => ProducerProfile::query()
                ->orderByDesc('id')
                ->get(['id', 'usina_nome', 'admin_nome']),
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
            ->route('admin.producer-leads.show', $producerLead->id)
            ->with('success', 'Lead de produtor atualizado com sucesso.');
    }
}