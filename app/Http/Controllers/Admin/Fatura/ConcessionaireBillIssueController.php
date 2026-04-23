<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Models\Fatura\ConcessionaireBillIssue;

class ConcessionaireBillIssueController extends Controller
{
    public function resolve(ConcessionaireBillIssue $issue)
    {
        $issue->update([
            'is_resolved' => true,
            'resolved_at' => now(),
            'resolved_by_user_id' => auth()->id(),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Divergência marcada como resolvida.');
    }
}