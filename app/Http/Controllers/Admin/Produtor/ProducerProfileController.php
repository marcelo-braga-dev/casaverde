<?php

namespace App\Http\Controllers\Admin\Produtor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Produtor\StoreProducerProfileRequest;
use App\Models\Endereco\Address;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Repositories\Produtor\ProducerProfileRepository;
use App\src\Roles\RoleUser;
use Inertia\Inertia;

class ProducerProfileController extends Controller
{
    public function index(ProducerProfileRepository $repository)
    {
        return Inertia::render('Consultor/Producer/Profile/Index/Page', [
            'producers' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Consultor/Producer/Profile/Create/Page', [
            'users' => User::query()
                ->where('role_id', RoleUser::$PRODUTOR)
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'consultor_id']),
            'responsaveisCadastro' => User::query()
                ->whereIn('role_id', [RoleUser::$ADMIN, RoleUser::$CONSULTOR])
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
            'addresses' => Address::query()
                ->orderByDesc('id')
                ->get(['id', 'rua', 'numero', 'bairro', 'cidade', 'estado']),
        ]);
    }

    public function store(StoreProducerProfileRequest $request)
    {
        $data = $request->validated();

        if (!isset($data['created_by_user_id']) || !$data['created_by_user_id']) {
            $data['created_by_user_id'] = auth()->id();
        }

        $producer = ProducerProfile::create($data);

        return redirect()
            ->route('consultor.producer.profiles.show', $producer->id)
            ->with('success', 'Perfil de produtor cadastrado com sucesso.');
    }

    public function show(ProducerProfile $producerProfile)
    {
        return Inertia::render('Consultor/Producer/Profile/Show/Page', [
            'producer' => $producerProfile->load([
                'user',
                'createdBy',
                'adminAddress',
                'usinaAddress',
            ]),
        ]);
    }

    public function edit(ProducerProfile $producerProfile)
    {
        return Inertia::render('Consultor/Producer/Profile/Edit/Page', [
            'producer' => $producerProfile->load([
                'user',
                'createdBy',
                'adminAddress',
                'usinaAddress',
            ]),
            'users' => User::query()
                ->where('role_id', RoleUser::$PRODUTOR)
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'consultor_id']),
            'responsaveisCadastro' => User::query()
                ->whereIn('role_id', [RoleUser::$ADMIN, RoleUser::$CONSULTOR])
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
            'addresses' => Address::query()
                ->orderByDesc('id')
                ->get(['id', 'rua', 'numero', 'bairro', 'cidade', 'estado']),
        ]);
    }

    public function update(StoreProducerProfileRequest $request, ProducerProfile $producerProfile)
    {
        $producerProfile->update($request->validated());

        return redirect()
            ->route('consultor.producer.profiles.show', $producerProfile->id)
            ->with('success', 'Perfil de produtor atualizado com sucesso.');
    }
}
