<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Models\Fatura\ConcessionaireBill;

class ApproveConcessionaireBillController extends Controller
{
    public function store(ConcessionaireBill $fatura)
    {
        $fatura->update([
            'review_status' => 'approved',
            'reviewed_by_user_id' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Fatura aprovada com sucesso.');
    }
}