<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Http\Requests\Fatura\ApproveConcessionaireBillsRequest;
use App\Models\Fatura\ConcessionaireBill;
use App\Services\Fatura\ApproveConcessionaireBillService;
use InvalidArgumentException;

class ApproveConcessionaireBillController extends Controller
{
    public function __construct(
        private readonly ApproveConcessionaireBillService $service,
    ) {}

    public function store(ConcessionaireBill $fatura)
    {
        try {
            $this->service->handle($fatura);
        } catch (InvalidArgumentException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()
            ->back()
            ->with('success', 'Fatura aprovada. A cobrança será gerada automaticamente em até 1 hora.');
    }

    public function storeMany(ApproveConcessionaireBillsRequest $request)
    {
        $result = $this->service->handleMany($request->validated('ids'));

        $message = "{$result['approved']} fatura(s) aprovada(s). As cobranças serão geradas automaticamente em até 1 hora.";

        if ($result['skipped'] !== []) {
            $message .= ' '.count($result['skipped']).' não aprovada(s): '
                .collect($result['skipped'])->map(fn ($reason, $id) => "#{$id} — {$reason}")->implode(' | ');
        }

        return redirect()->back()->with($result['approved'] > 0 ? 'success' : 'error', $message);
    }
}
