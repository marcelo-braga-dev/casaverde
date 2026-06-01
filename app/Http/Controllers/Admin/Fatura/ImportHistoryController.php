<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ImportedConcessionaireEmail;
use App\Models\Fatura\ImportRun;
use App\Services\Fatura\ImportAutomaticConcessionaireBillService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ImportHistoryController extends Controller
{
    // ── Listagem de runs ──────────────────────────────────────────────────

    public function index(Request $request)
    {
        $filters = $request->only(['status', 'triggered_by', 'client_profile_id', 'date_from', 'date_to']);

        $query = ImportRun::query()
            ->with(['triggeredByUser', 'clientProfile'])
            ->orderByDesc('started_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['triggered_by'])) {
            $query->where('triggered_by', $filters['triggered_by']);
        }

        if (!empty($filters['client_profile_id'])) {
            $query->where('client_profile_id', $filters['client_profile_id']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('started_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('started_at', '<=', $filters['date_to']);
        }

        // Estatísticas gerais dos últimos 30 dias
        $stats = $this->getStats();

        return Inertia::render('Admin/Fatura/ImportHistory/Index/Page', [
            'runs'    => $query->paginate(20)->withQueryString(),
            'filters' => $filters,
            'stats'   => $stats,
        ]);
    }

    // ── Detalhe de um run ─────────────────────────────────────────────────

    public function show(ImportRun $run)
    {
        $run->load(['triggeredByUser', 'clientProfile']);

        $emails = ImportedConcessionaireEmail::query()
            ->where('import_run_id', $run->id)
            ->with(['clientProfile', 'bill', 'setting.emailAccount'])
            ->orderByDesc('processed_at')
            ->paginate(30);

        return Inertia::render('Admin/Fatura/ImportHistory/Show/Page', [
            'run'    => $run,
            'emails' => $emails,
        ]);
    }

    // ── PDF do email importado ────────────────────────────────────────────

    public function pdf(ImportedConcessionaireEmail $email)
    {
        $bill = $email->bill;

        abort_if(!$bill || !$bill->pdf_path, 404, 'PDF não encontrado.');
        abort_if(!Storage::disk('local')->exists($bill->pdf_path), 404, 'Arquivo PDF não encontrado no disco.');

        return response()->file(
            Storage::disk('local')->path($bill->pdf_path),
            [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . ($bill->pdf_original_name ?? 'fatura.pdf') . '"',
            ]
        );
    }

    // ── Trigger manual de importação ──────────────────────────────────────

    public function trigger(Request $request, ImportAutomaticConcessionaireBillService $service)
    {
        $onlyClient = null;

        if ($request->filled('client_profile_id')) {
            $onlyClient = ClientProfile::findOrFail($request->integer('client_profile_id'));
        }

        $run = $service->run(
            onlyClient:        $onlyClient,
            triggeredBy:       'manual',
            triggeredByUserId: auth()->id(),
        );

        return back()->with('success', sprintf(
            'Importação concluída — Run %s: %d importadas, %d ignoradas, %d falharam.',
            $run->run_code,
            $run->total_imported,
            $run->total_skipped,
            $run->total_failed,
        ));
    }

    // ── Stats ─────────────────────────────────────────────────────────────

    private function getStats(): array
    {
        $since = now()->subDays(30);

        $runs  = ImportRun::query()->where('started_at', '>=', $since);
        $emails = ImportedConcessionaireEmail::query()
            ->whereHas('importRun', fn ($q) => $q->where('started_at', '>=', $since));

        return [
            'runs_total'      => (clone $runs)->count(),
            'runs_failed'     => (clone $runs)->where('status', 'failed')->count(),
            'emails_imported' => (clone $emails)->where('status', 'success')->count(),
            'emails_failed'   => (clone $emails)->where('status', 'failed')->count(),
            'emails_skipped'  => (clone $emails)->where('status', 'skipped')->count(),
            'last_run_at'     => ImportRun::query()->max('started_at'),
            'last_run_status' => ImportRun::query()->latest('started_at')->value('status'),
        ];
    }
}
