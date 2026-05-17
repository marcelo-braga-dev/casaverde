<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\StoreClientUsinaLinkRequest;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Usina\UsinaSolar;
use App\Services\Usina\SyncClientUsinaLinkService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class AdminClientUsinaLinkController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $search = $request->string('search')->toString();

        $links = ClientUsinaLink::query()
            ->with(['clientProfile', 'usina.produtor', 'usina.consultor'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($search, function ($query) use ($search) {
                $query->whereHas('clientProfile', function ($clientQuery) use ($search) {
                    $clientQuery->where('nome', 'like', "%{$search}%")
                        ->orWhere('razao_social', 'like', "%{$search}%")
                        ->orWhere('nome_fantasia', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('client_code', 'like', "%{$search}%");
                })->orWhereHas('usina.produtor', function ($producerQuery) use ($search) {
                    $producerQuery->where('name', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Usina/Links/Index/Page', [
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'links' => $links,
            'statusOptions' => ClientUsinaLinkStatus::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Usina/Links/Create/Page', [
            'statusOptions' => ClientUsinaLinkStatus::options(),
            'clients' => ClientProfile::query()
                ->orderByDesc('id')
                ->limit(500)
                ->get([
                    'id',
                    'client_code',
                    'tipo_pessoa',
                    'nome',
                    'razao_social',
                    'nome_fantasia',
                    'email',
                    'status',
                ]),
            'usinas' => UsinaSolar::query()
                ->with(['produtor'])
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function store(
        StoreClientUsinaLinkRequest $request,
        SyncClientUsinaLinkService $service
    ): RedirectResponse {
        try {
            $service->create($request->validated());

            return redirect()
                ->route('admin.usinas.links.index')
                ->with('success', 'Vínculo entre cliente e usina criado com sucesso.');
        } catch (RuntimeException $exception) {
            return back()
                ->withErrors(['allocated_energy_kwh' => $exception->getMessage()])
                ->withInput();
        }
    }

    public function destroy(
        ClientUsinaLink $link,
        SyncClientUsinaLinkService $service
    ): RedirectResponse {
        $service->cancel($link);

        return back()->with('success', 'Vínculo cancelado com sucesso.');
    }
}
