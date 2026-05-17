<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Enums\Usina\UsinaOperationalStatus;
use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Usina\UsinaSolar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUsinaManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $operationalStatus = $request->string('operational_status')->toString();

        $usinas = UsinaSolar::query()
            ->with(['produtor', 'consultor', 'concessionaria', 'block', 'address'])
            ->withCount([
                'clientLinks',
                'activeClientLinks',
                'generationRecords',
            ])
            ->when($operationalStatus, function ($query) use ($operationalStatus) {
                $query->where('operational_status', $operationalStatus);
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('uc', 'like', "%{$search}%")
                        ->orWhereHas('produtor', function ($producerQuery) use ($search) {
                            $producerQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('consultor', function ($consultorQuery) use ($search) {
                            $consultorQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        $summary = [
            'total_usinas' => UsinaSolar::query()->count(),
            'active_usinas' => UsinaSolar::query()
                ->where('operational_status', UsinaOperationalStatus::Active->value)
                ->count(),
            'maintenance_usinas' => UsinaSolar::query()
                ->where('operational_status', UsinaOperationalStatus::Maintenance->value)
                ->count(),
            'blocked_usinas' => UsinaSolar::query()
                ->where('operational_status', UsinaOperationalStatus::Blocked->value)
                ->count(),
            'total_available_energy_kwh' => (float) UsinaSolar::query()->sum('energia_disponivel_kwh'),
            'total_allocated_energy_kwh' => (float) UsinaSolar::query()->sum('energia_alocada_kwh'),
            'total_remaining_energy_kwh' => (float) UsinaSolar::query()->sum('energia_saldo_kwh'),
            'active_client_links' => ClientUsinaLink::query()
                ->where('is_active', true)
                ->where('status', 'active')
                ->count(),
        ];

        return Inertia::render('Admin/Usina/Management/Page', [
            'filters' => [
                'search' => $search,
                'operational_status' => $operationalStatus,
            ],
            'summary' => $summary,
            'usinas' => $usinas,
            'operationalStatusOptions' => UsinaOperationalStatus::options(),
        ]);
    }
}
