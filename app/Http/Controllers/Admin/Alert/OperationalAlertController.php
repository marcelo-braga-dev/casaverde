<?php

namespace App\Http\Controllers\Admin\Alert;

use App\Enums\Alert\OperationalAlertStatus;
use App\Http\Controllers\Controller;
use App\Models\Alert\OperationalAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OperationalAlertController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $severity = $request->string('severity')->toString();
        $module = $request->string('module')->toString();
        $search = $request->string('search')->toString();

        $alerts = OperationalAlert::query()
            ->with(['usina.produtor', 'clientProfile', 'assignedTo'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($severity, fn ($query) => $query->where('severity', $severity))
            ->when($module, fn ($query) => $query->where('module', $module))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%")
                        ->orWhereHas('usina', function ($usinaQuery) use ($search) {
                            $usinaQuery->where('uc', 'like', "%{$search}%");
                        })
                        ->orWhereHas('clientProfile', function ($clientQuery) use ($search) {
                            $clientQuery->where('nome', 'like', "%{$search}%")
                                ->orWhere('razao_social', 'like', "%{$search}%")
                                ->orWhere('client_code', 'like', "%{$search}%");
                        });
                });
            })
            ->orderByRaw("FIELD(status, 'open', 'in_progress', 'resolved', 'ignored')")
            ->orderByRaw("FIELD(severity, 'critical', 'error', 'warning', 'info')")
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        $summary = [
            'open' => OperationalAlert::query()->where('status', 'open')->count(),
            'in_progress' => OperationalAlert::query()->where('status', 'in_progress')->count(),
            'resolved' => OperationalAlert::query()->where('status', 'resolved')->count(),
            'critical' => OperationalAlert::query()->where('severity', 'critical')->whereIn('status', ['open', 'in_progress'])->count(),
            'error' => OperationalAlert::query()->where('severity', 'error')->whereIn('status', ['open', 'in_progress'])->count(),
            'warning' => OperationalAlert::query()->where('severity', 'warning')->whereIn('status', ['open', 'in_progress'])->count(),
        ];

        return Inertia::render('Admin/Alert/Operational/Index/Page', [
            'alerts' => $alerts,
            'summary' => $summary,
            'filters' => [
                'status' => $status,
                'severity' => $severity,
                'module' => $module,
                'search' => $search,
            ],
            'statusOptions' => [
                ['value' => '', 'label' => 'Todos'],
                ['value' => 'open', 'label' => 'Aberto'],
                ['value' => 'in_progress', 'label' => 'Em Tratamento'],
                ['value' => 'resolved', 'label' => 'Resolvido'],
                ['value' => 'ignored', 'label' => 'Ignorado'],
            ],
            'severityOptions' => [
                ['value' => '', 'label' => 'Todas'],
                ['value' => 'critical', 'label' => 'Crítico'],
                ['value' => 'error', 'label' => 'Erro'],
                ['value' => 'warning', 'label' => 'Atenção'],
                ['value' => 'info', 'label' => 'Informativo'],
            ],
            'moduleOptions' => [
                ['value' => '', 'label' => 'Todos'],
                ['value' => 'usina', 'label' => 'Usina'],
                ['value' => 'fatura', 'label' => 'Fatura'],
                ['value' => 'financeiro', 'label' => 'Financeiro'],
            ],
        ]);
    }
}
