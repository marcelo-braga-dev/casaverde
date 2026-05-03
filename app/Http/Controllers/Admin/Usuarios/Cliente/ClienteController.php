<?php

namespace App\Http\Controllers\Admin\Usuarios\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Usina\Concessionaria;
use App\Http\Requests\Cliente\StoreClientProfileRequest;
use App\Models\Cliente\ClientProfile;
use App\Models\Usina\UsinaSolar;
use App\Repositories\Cliente\ClientProfileRepository;
use App\Services\Cliente\CreateOrFindClientProfileService;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index(ClientProfileRepository $repository)
    {
        $this->authorize('viewAny', ClientProfile::class);

        return Inertia::render('Consultor/Cliente/Profile/Index/Page', [
            'clients' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        $this->authorize('create', ClientProfile::class);

        return Inertia::render('Consultor/Cliente/Profile/Create/Page');
    }

    public function store(
        StoreClientProfileRequest $request,
        CreateOrFindClientProfileService $service
    ) {
        $this->authorize('create', ClientProfile::class);

        $result = $service->handle($request->validated());

        return redirect()
            ->route('consultor.propostas.cliente.create', [
                'client_profile_id' => $result['client_profile']->id,
            ])
            ->with('success', $result['message']);
    }

    public function show(ClientProfile $cliente)
    {
        $this->authorize('view', $cliente);

        return Inertia::render('Consultor/Cliente/Profile/Show/Page', [

            'client' => $cliente->load([
                'consultor',
                'platformUser',
                'activeUsinaLink.usina',
                'activeDiscountRule',
                'usinaLinks.usina',
                'discountRules',
                'emailImportSetting.concessionaria',
                'proposals.concessionaria',
                'proposals.contract',
                'accessInvites',
                'proposals.address',
            ]),

            'usinas' => UsinaSolar::query()
                ->with(['produtor'])
                ->orderByDesc('id')
                ->get(['id', 'uc', 'user_id']),

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
        ]);
    }
}
