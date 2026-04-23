<?php

namespace App\Services\Proposta;

use App\Models\Proposta\CommercialProposal;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateCommercialProposalPdfService
{
    public function stream(CommercialProposal $proposal)
    {
        $pdf = Pdf::loadView('pdf.propostas.commercial-proposal', [
            'proposal' => $proposal->load(['clientProfile', 'consultor']),
        ])->setPaper('a4');

        return $pdf->stream("proposta-{$proposal->proposal_code}.pdf");
    }

    public function download(CommercialProposal $proposal)
    {
        $pdf = Pdf::loadView('pdf.propostas.commercial-proposal', [
            'proposal' => $proposal->load(['clientProfile', 'consultor']),
        ])->setPaper('a4');

        return $pdf->download("proposta-{$proposal->proposal_code}.pdf");
    }
}