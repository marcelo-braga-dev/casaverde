<?php

namespace App\Services\Proposta;

use App\Models\Proposta\ProducerProposal;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateProducerProposalPdfService
{
    public function __construct(
        private readonly ProposalPdfBrand $brand,
        private readonly CalculateProducerProposalInvestmentService $investment,
    ) {}

    public function stream(ProducerProposal $proposal)
    {
        return $this->build($proposal)->stream("proposta-produtor-{$proposal->proposal_code}.pdf");
    }

    private function build(ProducerProposal $proposal)
    {
        $proposal->load(['producerProfile.activeFeeRule', 'producerProfile.contacts', 'consultor', 'concessionaria', 'address']);

        return Pdf::loadView('pdf.propostas.producer-proposal-modern', [
            'proposal' => $proposal,
            'brand' => $this->brand->toArray(),
            'numbers' => $this->numbers($proposal),
        ])->setPaper('a4');
    }

    /** Valores da proposta já calculados, para a view só exibir. */
    public function numbers(ProducerProposal $proposal): array
    {
        $summary = $this->investment->handle($proposal);

        $investment = (float) ($proposal->valor_investimento ?? 0);
        $months = (int) ($proposal->prazo_contrato ?: 12);
        $monthly = (float) $summary['pagamento_mensal_previsto'];
        $contract = round($monthly * $months, 2);
        $tariff = (float) $summary['tarifa_grupo_b'];

        return [
            ...$summary,
            'investment' => $investment,
            'months' => $months,
            'monthly' => $monthly,
            'yearly' => round($monthly * 12, 2),
            'contract' => $contract,
            'generation' => (float) ($proposal->media_geracao ?? 0),
            'power' => (float) ($proposal->potencia_usina ?? 0),
            'payback_months' => $investment > 0 && $monthly > 0 ? (int) ceil($investment / $monthly) : null,
            'roi_percent' => $investment > 0 ? round(($contract - $investment) / $investment * 100, 1) : null,
            // Fatias do kWh (tarifa = 100%), para a barra "como se forma o seu kWh".
            'split' => $tariff > 0 ? [
                'producer' => max(0, round($summary['valor_pago_produtor_kwh'] / $tariff * 100, 1)),
                'consumer' => round($summary['consumer_discount_value'] / $tariff * 100, 1),
                'admin' => round($summary['admin_fee_value_kwh'] / $tariff * 100, 1),
            ] : null,
            'projection' => $this->projection($monthly, $months, $investment),
        ];
    }

    /** Receita acumulada ao fim de cada ano do contrato, com a altura relativa de cada barra. */
    private function projection(float $monthly, int $months, float $investment): array
    {
        $top = max($monthly * $months, $investment, 1);

        $years = collect(range(1, max(1, (int) ceil($months / 12))))->map(function (int $year) use ($monthly, $months, $investment, $top) {
            $total = $monthly * min($year * 12, $months);

            return [
                'year' => $year,
                'total' => round($total, 2),
                'ratio' => round($total / $top * 100, 1),
                'paid_back' => $investment > 0 && $total >= $investment,
            ];
        })->all();

        return [
            'years' => $years,
            'investment_ratio' => $investment > 0 ? round($investment / $top * 100, 1) : null,
        ];
    }
}
