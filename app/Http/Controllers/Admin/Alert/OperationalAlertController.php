<?php

namespace App\Http\Controllers\Admin\Alert;

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

        $user = $request->user();

        $visible = fn () => OperationalAlert::query()->visibleTo($user);

        $alerts = $visible()
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
            // CASE em vez de FIELD(): FIELD é só do MySQL e quebra a suíte em SQLite.
            ->orderByRaw("CASE status WHEN 'open' THEN 1 WHEN 'in_progress' THEN 2 WHEN 'resolved' THEN 3 WHEN 'ignored' THEN 4 ELSE 5 END")
            ->orderByRaw("CASE severity WHEN 'critical' THEN 1 WHEN 'error' THEN 2 WHEN 'warning' THEN 3 WHEN 'info' THEN 4 ELSE 5 END")
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        $summary = [
            'open' => $visible()->where('status', 'open')->count(),
            'in_progress' => $visible()->where('status', 'in_progress')->count(),
            'resolved' => $visible()->where('status', 'resolved')->count(),
            'critical' => $visible()->where('severity', 'critical')->whereIn('status', ['open', 'in_progress'])->count(),
            'error' => $visible()->where('severity', 'error')->whereIn('status', ['open', 'in_progress'])->count(),
            'warning' => $visible()->where('severity', 'warning')->whereIn('status', ['open', 'in_progress'])->count(),
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
                ['value' => 'sistema', 'label' => 'Sistema'],
            ],
        ]);
    }
}
