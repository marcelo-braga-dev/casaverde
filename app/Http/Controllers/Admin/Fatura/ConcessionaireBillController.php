<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Http\Requests\Fatura\StoreConcessionaireBillsBulkRequest;
use App\Http\Requests\Fatura\UpdateConcessionaireBillReviewRequest;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use App\Services\Fatura\DeleteConcessionaireBillService;
use App\Services\Fatura\ReviewConcessionaireBillService;
use App\Services\Fatura\StoreParsedConcessionaireBillService;
use App\Services\Fatura\SuggestBillUsinaService;
use App\Services\Fatura\ValidateConcessionaireBillService;
use Inertia\Inertia;
use RuntimeException;

class ConcessionaireBillController extends Controller
{
    public function create()
    {
        return Inertia::render('Consultor/Cliente/Fatura/Create/Page', [
            'clients' => ClientProfile::query()
                ->orderByDesc('id')
                ->get(['id', 'client_code', 'nome', 'razao_social', 'cpf', 'cnpj']),
        ]);
    }

    public function store(
        StoreConcessionaireBillsBulkRequest $request,
        StoreParsedConcessionaireBillService $service,
        ValidateConcessionaireBillService $validateService
    ) {
        $clientProfileId = $request->integer('client_profile_id');
        $imported = 0;
        $failures = [];

        foreach ($request->file('pdfs') as $pdf) {
            try {
                $bill = $service->handle([
                    'client_profile_id' => $clientProfileId,
                    'pdf' => $pdf,
                ]);

                $validateService->handle($bill);
                $imported++;
            } catch (\Throwable $e) {
                $failures[] = sprintf('%s: %s', $pdf->getClientOriginalName(), $e->getMessage());
            }
        }

        $message = sprintf('%d fatura(s) importada(s) com sucesso.', $imported);

        if ($failures) {
            $message .= ' Falharam: '.implode(' | ', $failures);
        }

        return redirect()
            ->route('admin.relatorios.faturas')
            ->with($failures ? 'warning' : 'success', $message);
    }

    public function show(
        ConcessionaireBill $fatura,
        SuggestBillUsinaService $suggestBillUsinaService
    ) {
        $fatura->load([
            'clientProfile',
            'clientProfile.activeUsinaLink.usina',
            'clientProfile.activeDiscountRule',
            'clientProfile.emailImportSetting.concessionaria',
            'consumerUnit.activeUsinaLink.usina',
            'concessionaria',
            'usina',
            'createdBy',
            'reviewedBy',
            'issues',
        ]);

        return Inertia::render('Consultor/Cliente/Fatura/Show/Page', [
            'bill' => $fatura,
            'emailImportSetting' => $fatura->clientProfile?->emailImportSetting,

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),

            'suggestedUsinaId' => $suggestBillUsinaService->handle($fatura),
            'reviewStatuses' => ['pending_review', 'reviewed', 'corrected', 'approved'],

            'usinas' => UsinaSolar::query()
                ->orderByDesc('id')
                ->get(['id', 'uc']),

            'consumerUnits' => ConsumerUnit::query()
                ->where('client_profile_id', $fatura->client_profile_id)
                ->orderBy('uc_code')
                ->get(['id', 'client_profile_id', 'uc_code', 'label', 'status']),
        ]);
    }

    public function update(
        ConcessionaireBill $fatura,
        UpdateConcessionaireBillReviewRequest $request,
        ReviewConcessionaireBillService $service
    ) {
        $service->handle($fatura, $request->validated());

        return redirect()
            ->route('consultor.cliente.faturas.show', $fatura->id)
            ->setStatusCode(303)
            ->with('success', 'Fatura de Concessionária revisada com sucesso.');
    }

    public function destroy(ConcessionaireBill $fatura, DeleteConcessionaireBillService $service)
    {
        try {
            $service->handle($fatura);
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('admin.relatorios.faturas')
            ->with('success', 'Fatura de Concessionária e todos os registros relacionados foram excluídos com sucesso.');
    }
}
