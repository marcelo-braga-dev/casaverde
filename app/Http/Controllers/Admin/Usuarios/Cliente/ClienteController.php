<?php

namespace App\Http\Controllers\Admin\Usuarios\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreClientProfileRequest;
use App\Models\Cliente\ClientProfile;
use App\Models\Importacao\ImportEmailAccount;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use App\Repositories\Cliente\ClientProfileRepository;
use App\Services\Acesso\GerenciarAcessoService;
use App\Services\Cliente\CreateOrFindClientProfileService;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index(ClientProfileRepository $repository)
    {
        $this->authorize('viewAny', ClientProfile::class);

        $filters = request()->only(['search', 'status', 'tipo_pessoa']);

        return Inertia::render('Consultor/Cliente/Profile/Index/Page', [
            'clients' => $repository->paginate(20, $filters),
            'filters' => $filters,
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
            ->back()
            ->with([
                'success' => $result['message'],
                'client_created' => true,
                'client_id' => $result['client_profile']->id,
            ]);
    }

    public function show(ClientProfile $cliente)
    {
        $this->authorize('view', $cliente);

        return Inertia::render('Consultor/Cliente/Profile/Show/Page', [

            'client' => $cliente->load([
                'contacts',
                'consultor',
                'platformUser',
                'activeUsinaLink.usina',
                'activeDiscountRule',
                'usinaLinks.usina',
                'usinaLinks.consumerUnit',
                'discountRules',
                'emailImportSetting.concessionaria',
                'emailImportSetting.emailAccount',
                'proposals.concessionaria',
                'proposals.contract',
                'accessInvites',
                'proposals.address',
                'consumerUnits.concessionaria',
                'consumerUnits.address',
                'consumerUnits.activeUsinaLink.usina.produtor',
                'consumerUnits.activeUsinaLinks.usina.produtor',
            ]),

            'usinas' => UsinaSolar::query()
                ->with(['produtor'])
                ->orderByDesc('id')
                ->get(['id', 'usina_nome', 'uc', 'producer_profile_id']),

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),

            // Emails disponíveis no pool
            'availableEmails' => ImportEmailAccount::query()
                ->where('is_active', true)
                ->where(function ($q) use ($cliente) {
                    $q->whereNull('client_profile_id')
                        ->orWhere('client_profile_id', $cliente->id);
                })
                ->orderBy('email')
                ->get(['id', 'email', 'label', 'client_profile_id']),

            // Histórico de acesso do usuário plataforma do cliente
            'accessHistory' => $cliente->platform_user_id
                ? app(GerenciarAcessoService::class)->historico($cliente->platform_user_id)
                : [],
        ]);
    }

    public function edit(ClientProfile $cliente)
    {
        return Inertia::render('Consultor/Cliente/Profile/Edit/Page',
            ['client' => $cliente]);
    }

    public function update(StoreClientProfileRequest $request, ClientProfile $cliente)
    {
        $cliente->update($request->validated());
        $cliente->contacts()->update($request->only(['celular', 'telefone', 'email']));

        return redirect()
            ->route('consultor.user.cliente.show', $cliente->id)
            ->with('success', 'Cliente atualizado com sucesso.');
    }

    public function destroy(ClientProfile $cliente)
    {
        $cliente->delete();

        return redirect()->route('consultor.user.cliente.index')
            ->with([
                'success' => 'Cliente deletado com sucesso',
            ]);
    }
}
