<?php

namespace App\Services\Proposta;

use App\Models\Proposta\ProducerProposal;
use App\Services\Config\SystemSettingService;

class CalculateProducerProposalInvestmentService
{
    public function __construct(
        private SystemSettingService $settingService,
    ) {}

    public function handle(ProducerProposal $proposal): array
    {
        $tarifaGrupoB = (float) ($proposal->concessionaria?->tarifa_gd2 ?? 0);

        $consumerDiscountPercent = (float) $this->settingService->get(
            'producer_proposal_consumer_discount_percentage',
            20,
        );

        $adminFeePercent = (float) (
            $proposal->producerProfile?->activeFeeRule?->fee_percent
            ?? $this->settingService->get('default_producer_fee_percentage', 15)
        );

        $producaoMensalKwh = (float) ($proposal->media_geracao ?? 0);
        $producaoAnualKwh = $producaoMensalKwh * 12;

        $pagamentoAnualBruto = $producaoAnualKwh * $tarifaGrupoB;
        $adminFeeValue = round($pagamentoAnualBruto * $adminFeePercent / 100, 2);
        $consumerDiscountValue = round($tarifaGrupoB * $consumerDiscountPercent / 100, 4);
        $adminFeeValueKwh = round($tarifaGrupoB * $adminFeePercent / 100, 4);
        $valorPagoProdutorKwh = round($tarifaGrupoB - $consumerDiscountValue - $adminFeeValueKwh, 4);

        return [
            'tarifa_grupo_b' => round($tarifaGrupoB, 4),
            'consumer_discount_percent' => $consumerDiscountPercent,
            'consumer_discount_value' => $consumerDiscountValue,
            'admin_fee_percent' => $adminFeePercent,
            'admin_fee_value' => $adminFeeValue,
            'admin_fee_value_kwh' => $adminFeeValueKwh,
            'valor_pago_produtor_kwh' => $valorPagoProdutorKwh,
            'producao_anual_kwh' => round($producaoAnualKwh, 2),
            'pagamento_anual_bruto' => round($pagamentoAnualBruto, 2),
            'pagamento_anual_liquido' => round($pagamentoAnualBruto * (1 - $adminFeePercent / 100), 2),
            'pagamento_mensal_previsto' => round($producaoMensalKwh * $valorPagoProdutorKwh, 2),
        ];
    }
}
