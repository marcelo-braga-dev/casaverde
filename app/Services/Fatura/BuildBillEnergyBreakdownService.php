<?php

namespace App\Services\Fatura;

use App\Models\Fatura\ConcessionaireBill;

class BuildBillEnergyBreakdownService
{
    public function handle(ConcessionaireBill $bill): array
    {
        $items = $bill->extracted_payload['items'] ?? [];

        $injectedEnergyItems = CopelBillParserService::filterByPrefixes($items, CopelBillParserService::INJECTED_ENERGY_PREFIXES);
        $injectedConsumptionItems = CopelBillParserService::filterByPrefixes($items, CopelBillParserService::INJECTED_CONSUMPTION_PREFIXES);

        $consumptionAmount = (float) ($bill->injected_consumption_amount ?? 0);
        $discountPercent = (float) ($bill->injected_consumption_discount_percent ?? 0);
        $discountAmount = round($consumptionAmount * ($discountPercent / 100), 2);

        // A margem de desconto é sempre subtraída do Consumo Injetado para chegar
        // ao valor cobrado ao cliente — mesma fórmula usada em GenerateCustomerChargeFromBillService.
        $finalAmount = (float) max(0, round(abs($consumptionAmount) - abs($discountAmount), 2));

        return [
            'injected_energy' => [
                'prefixes' => CopelBillParserService::INJECTED_ENERGY_PREFIXES,
                'items' => $injectedEnergyItems,
                'kwh_total' => round(array_sum(array_column($injectedEnergyItems, 'quantidade')), 2),
                'amount_total' => round(array_sum(array_column($injectedEnergyItems, 'valor')), 2),
            ],
            'injected_consumption' => [
                'prefixes' => CopelBillParserService::INJECTED_CONSUMPTION_PREFIXES,
                'items' => $injectedConsumptionItems,
                'kwh_total' => round(array_sum(array_column($injectedConsumptionItems, 'quantidade')), 2),
                'amount_total' => round(array_sum(array_column($injectedConsumptionItems, 'valor')), 2),
            ],
            'discount' => [
                'base_amount' => round($consumptionAmount, 2),
                'percent' => round($discountPercent, 2),
                'amount' => $discountAmount,
                'final_amount' => $finalAmount,
            ],
        ];
    }
}
