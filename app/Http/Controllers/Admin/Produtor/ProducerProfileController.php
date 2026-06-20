<?php

namespace App\Http\Controllers\Admin\Produtor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Produtor\StoreProducerProfileRequest;
use App\Models\Endereco\Address;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Repositories\Produtor\ProducerProfileRepository;
use App\Services\Acesso\GerenciarAcessoService;
use App\Services\Config\SystemSettingService;
use App\Services\Produtor\CreateOrFindProducerProfileService;
use App\src\Roles\RoleUser;
use Inertia\Inertia;

class ProducerProfileController extends Controller
{
    public function __construct(
        private SystemSettingService $settingService,
    ) {}

    public function index(ProducerProfileRepository $repository)
    {
        $filters = request()->only(['search', 'status', 'tipo_pessoa']);

        return Inertia::render('Consultor/Producer/Profile/Index/Page', [
            'producers' => $repository->paginate(20, $filters),
            'filters' => $filters,
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

    public function store(StoreProducerProfileRequest $request,
        CreateOrFindProducerProfileService $service
    ) {
        // $this->authorize('create', ProducerProfile::class);
        $result = $service->handle($request->validated());

        return redirect()
            ->route('consultor.producer.profiles.create', [
                'producer_profile_id' => $result['producer_profile']->id,
            ])
            ->with([
                'success' => $result['message'],
                'producer_created' => true,
                'producer_id' => $result['producer_profile']->id,
            ]);
    }

    public function show(ProducerProfile $producerProfile)
    {
        $producerProfile->load(['proposals', 'consultor', 'usinas', 'usinas.activeClientLinks', 'platformUser', 'activeFeeRule']);

        $isAdmin = auth()->user()?->role_id === RoleUser::$ADMIN;

        // Taxa de administração (margem) só fica visível para admin
        if (! $isAdmin) {
            $producerProfile->unsetRelation('activeFeeRule');
        }

        return Inertia::render('Consultor/Producer/Profile/Show/Page', [
            'producer' => $producerProfile,
            'defaultFeePercentage' => $isAdmin
                ? (float) $this->settingService->get('default_producer_fee_percentage', 15)
                : null,
            'accessHistory' => $producerProfile->platform_user_id
                ? app(GerenciarAcessoService::class)->historico($producerProfile->platform_user_id)
                : [],
        ]);
    }

    public function edit(ProducerProfile $producerProfile)
    {
        return Inertia::render('Consultor/Producer/Profile/Edit/Page', [
            'producer' => $producerProfile,
        ]);
    }

    public function update(StoreProducerProfileRequest $request, ProducerProfile $producerProfile)
    {
        $producerProfile->update($request->validated());
        $producerProfile->contacts()->update($request->only(['celular', 'telefone', 'email']));

        return redirect()
            ->route('consultor.producer.profiles.show', $producerProfile->id)
            ->with('success', 'Perfil de produtor atualizado com sucesso.');
    }

    public function destroy(ProducerProfile $producerProfile)
    {
        $producerProfile->delete();

        return redirect()->route('consultor.producer.profiles.index')
            ->with([
                'success' => 'Produtor deletado com sucesso',
            ]);
    }
}
