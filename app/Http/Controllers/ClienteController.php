<?php

namespace App\Http\Controllers\Admin\Usuarios\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreClientProfileRequest;
use App\Models\Cliente\ClientProfile;
use App\Repositories\Cliente\ClientProfileRepository;
use App\Services\Cliente\CreateOrFindClientProfileService;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index(ClientProfileRepository $repository)
    {
        $this->authorize('viewAny', ClientProfile::class);

        return Inertia::render('Admin/Cliente/Index/Page', [
            'clients' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        $this->authorize('create', ClientProfile::class);

        return Inertia::render('Admin/Cliente/Create/Page');
    }

    public function store(
        StoreClientProfileRequest $request,
        CreateOrFindClientProfileService $service
    ) {
        $this->authorize('create', ClientProfile::class);

        $result = $service->handle($request->validated());

        return redirect()
            ->route('admin.user.cliente.show', $result['client_profile']->id)
            ->with('success', $result['message']);
    }

    public function show(ClientProfile $cliente)
    {
        $this->authorize('view', $cliente);

        return Inertia::render('Admin/Cliente/Show/Page', [
            'client' => $cliente->load([
                'consultor',
                'platformUser',
                'activeUsinaLink.usina',
                'activeDiscountRule',
                'proposals.concessionaria',
                'accessInvites',
            ]),
        ]);
    }
}