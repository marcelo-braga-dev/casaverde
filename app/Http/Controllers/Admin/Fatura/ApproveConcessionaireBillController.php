<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Http\Requests\Fatura\ApproveConcessionaireBillRequest;
use App\Http\Requests\Fatura\ApproveConcessionaireBillsRequest;
use App\Models\Fatura\ConcessionaireBill;
use App\Services\Fatura\ApproveConcessionaireBillService;
use InvalidArgumentException;

class ApproveConcessionaireBillController extends Controller
{
    public function __construct(
        private readonly ApproveConcessionaireBillService $service,
    ) {}

    public function store(ApproveConcessionaireBillRequest $request, ConcessionaireBill $fatura)
    {
        try {
            $bill = $this->service->handle($fatura, $request->validated('charge_due_date'));
        } catch (InvalidArgumentException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        $charge = $bill->relationLoaded('customerCharge') ? $bill->customerCharge : null;

        return redirect()->back()->with(...match ($charge?->status) {
            'open' => ['success', "Fatura aprovada e cobrança #{$charge->id} aberta."],
            'draft' => ['warning', "Fatura aprovada. A cobrança #{$charge->id} ficou em rascunho: informe um vencimento futuro na tela da cobrança para abri-la."],
            default => ['warning', 'Fatura aprovada, mas a cobrança não foi gerada agora. A rotina automática tenta de novo em até 1 hora.'],
        });
    }

    public function storeMany(ApproveConcessionaireBillsRequest $request)
    {
        $result = $this->service->handleMany($request->validated('ids'), $request->validated('charge_due_date'));

        $message = "{$result['approved']} fatura(s) aprovada(s): {$result['opened']} cobrança(s) aberta(s)";
        $message .= $result['drafts'] > 0 ? ", {$result['drafts']} em rascunho (vencimento passado ou valor zerado)." : '.';

        if ($result['skipped'] !== []) {
            $message .= ' '.count($result['skipped']).' não aprovada(s): '
                .collect($result['skipped'])->map(fn ($reason, $id) => "#{$id} — {$reason}")->implode(' | ');
        }

        return redirect()->back()->with($result['approved'] > 0 ? 'success' : 'error', $message);
    }
}
