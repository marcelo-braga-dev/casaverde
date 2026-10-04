<?php

namespace App\Services\Proposta;

use App\Models\Proposta\CommercialProposal;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateCommercialProposalPdfService
{
    // Modelo novo, com a identidade visual configurada. Por enquanto só na demonstração;
    // a instalação da Casa Verde segue com o modelo original.
    private const MODERN_VIEW = 'pdf.propostas.commercial-proposal-modern';

    private const LEGACY_VIEW = 'pdf.propostas.commercial-proposal';

    public function __construct(private readonly ProposalPdfBrand $brand) {}

    public function stream(CommercialProposal $proposal)
    {
        return $this->build($proposal)->stream("proposta-{$proposal->proposal_code}.pdf");
    }

    public function download(CommercialProposal $proposal)
    {
        return $this->build($proposal)->download("proposta-{$proposal->proposal_code}.pdf");
    }

    private function build(CommercialProposal $proposal)
    {
        $proposal->load(['clientProfile', 'consultor', 'concessionaria']);

        if (! config('demo.enabled')) {
            return Pdf::loadView(self::LEGACY_VIEW, ['proposal' => $proposal])->setPaper('a4');
        }

        return Pdf::loadView(self::MODERN_VIEW, [
            'proposal' => $proposal,
            'brand' => $this->brand->toArray(),
            'numbers' => $this->numbers($proposal),
        ])->setPaper('a4');
    }

    /** Valores da proposta já calculados, para a view só exibir. */
    public function numbers(CommercialProposal $proposal): array
    {
        $current = (float) ($proposal->valor_medio ?? 0);
        $discount = (float) ($proposal->discount_percent ?? 0);
        $months = (int) ($proposal->prazo_locacao ?: 12);

        $newBill = round($current * (1 - $discount / 100), 2);
        $monthly = round($current - $newBill, 2);

        return [
            'current' => $current,
            'new_bill' => $newBill,
            'discount' => $discount,
            'consumption' => (float) ($proposal->media_consumo ?? 0),
            'months' => $months,
            'monthly' => $monthly,
            'yearly' => round($monthly * 12, 2),
            'contract' => round($monthly * $months, 2),
            // Altura relativa das barras do comparativo (conta atual = 100%).
            'new_bill_ratio' => $current > 0 ? max(0, min(100, $newBill / $current * 100)) : 0,
            'periods' => collect(['Mensal' => 1, 'Trimestral' => 3, 'Semestral' => 6, 'Anual' => 12, "Contrato ({$months} meses)" => $months])
                ->map(fn ($factor, $label) => [
                    'label' => $label,
                    'current' => $current * $factor,
                    'new_bill' => $newBill * $factor,
                    'saving' => $monthly * $factor,
                ])->values()->all(),
        ];
    }
}
