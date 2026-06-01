<?php

namespace App\Http\Controllers\Admin\Usuarios\Consultor;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;
use App\Repositories\Consultor\ConsultorRepository;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultorController extends Controller
{
    public function index()
    {
        $filters = request()->only(['search', 'status']);

        $query = User::query()
            ->with(['userData'])
            ->withCount(['clientes', 'produtores'])
            ->where('role_id', RoleUser::$CONSULTOR)
            ->latest();

        if (!empty($filters['search'])) {
            $s = '%' . $filters['search'] . '%';
            $query->where(fn ($q) =>
                $q->where('name', 'like', $s)
                  ->orWhere('email', 'like', $s)
            );
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return Inertia::render('Admin/User/Consultor/Index/Page', [
            'consultores' => $query->paginate(20)->withQueryString(),
            'filters'     => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render(
            'Admin/User/Consultor/Create/Page'
        );
    }

    public function store(Request $request)
    {
        $consultor = (
        new ConsultorRepository()
        )->create($request);

        return redirect()->route(
            'admin.user.consultor.show',
            $consultor->id
        );
    }

    public function show(User $consultor)
    {
        abort_unless(
            $consultor->isConsultor(),
            404
        );

        $consultor->load([
            'userData',
        ]);

        $clients = ClientProfile::query()
            ->where(
                'consultor_user_id',
                $consultor->id
            )
            ->latest()
            ->take(10)
            ->get();

        $proposals = CommercialProposal::query()
            ->with([
                'clientProfile',
                'concessionaria',
            ])
            ->where(
                'consultor_user_id',
                $consultor->id
            )
            ->latest()
            ->take(10)
            ->get();

        $usinas = UsinaSolar::query()
            ->where(
                'consultor_user_id',
                $consultor->id
            )
            ->latest()
            ->take(10)
            ->get();

        $producers = User::query()
            ->with([
                'userData',
                'contatos',
            ])
            ->where(
                'consultor_id',
                $consultor->id
            )
            ->where(
                'role_id',
                RoleUser::$PRODUTOR
            )
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render(
            'Admin/User/Consultor/Show/Page',
            [
                'consultor' => $consultor,

                'stats' => [
                    'clients_count' =>
                        $consultor->clientes()->count(),

                    'proposals_count' =>
                        CommercialProposal::query()
                            ->where(
                                'consultor_user_id',
                                $consultor->id
                            )
                            ->count(),

                    'usinas_count' =>
                        UsinaSolar::query()
                            ->where(
                                'consultor_user_id',
                                $consultor->id
                            )
                            ->count(),

                    'producers_count' =>
                        $consultor->produtores()->count(),
                ],

                'clients' => $clients,

                'proposals' => $proposals,

                'usinas' => $usinas,

                'producers' => $producers,
            ]
        );
    }
}
