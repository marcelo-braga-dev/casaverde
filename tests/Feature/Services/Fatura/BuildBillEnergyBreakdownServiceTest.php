<?php

use App\Models\Fatura\ConcessionaireBill;
use App\Services\Fatura\BuildBillEnergyBreakdownService;

describe('BuildBillEnergyBreakdownService', function () {

    beforeEach(function () {
        $this->service = app(BuildBillEnergyBreakdownService::class);
    });

    it('groups the extracted items by calculation bucket and totals match the bill columns', function () {
        $bill = ConcessionaireBill::factory()->create([
            'injected_energy_kwh' => -2034.00,
            'injected_energy_amount' => -560.86,
            'injected_consumption_kwh' => -5031.74,
            'injected_consumption_amount' => -1147.91,
            'injected_consumption_discount_percent' => 20.00,
            'extracted_payload' => [
                'items' => [
                    ['descricao' => 'ENERGIA ELET CONSUMO', 'quantidade' => 2716.0, 'valor' => 999.30],
                    ['descricao' => 'ENERGIA INJ. OUC MPT TE 08/2025 GDII-II', 'quantidade' => -168.0, 'valor' => -46.32],
                    ['descricao' => 'ENERGIA INJ. OUC MPT TUS 08/2025 GDII-II', 'quantidade' => -168.0, 'valor' => -45.55],
                    ['descricao' => 'ENERGIA INJ. BAND. AMARELA TE', 'quantidade' => -963.74, 'valor' => -19.62],
                ],
            ],
        ]);

        $breakdown = $this->service->handle($bill);

        expect($breakdown['injected_energy']['items'])->toHaveCount(1)
            ->and($breakdown['injected_energy']['kwh_total'])->toBe(-168.0)
            ->and($breakdown['injected_energy']['amount_total'])->toBe(-46.32);

        expect($breakdown['injected_consumption']['items'])->toHaveCount(3)
            ->and($breakdown['injected_consumption']['kwh_total'])->toBe(-1299.74)
            ->and($breakdown['injected_consumption']['amount_total'])->toBe(-111.49);

        expect($breakdown['discount']['base_amount'])->toBe(-1147.91)
            ->and($breakdown['discount']['percent'])->toBe(20.0)
            ->and($breakdown['discount']['amount'])->toBe(-229.58)
            ->and($breakdown['discount']['final_amount'])->toBe(918.33);
    });

    it('subtracts the discount from the injected consumption to compute final_amount, never adds it', function () {
        $bill = ConcessionaireBill::factory()->create([
            'injected_consumption_amount' => -1000.00,
            'injected_consumption_discount_percent' => 20.00,
        ]);

        $breakdown = $this->service->handle($bill);

        expect($breakdown['discount']['amount'])->toBe(-200.0)
            ->and($breakdown['discount']['final_amount'])->toBe(800.0);
    });

    it('never returns a negative final_amount', function () {
        $bill = ConcessionaireBill::factory()->create([
            'injected_consumption_amount' => -100.00,
            'injected_consumption_discount_percent' => 150.00,
        ]);

        $breakdown = $this->service->handle($bill);

        expect($breakdown['discount']['final_amount'])->toBe(0.0);
    });

    it('returns empty buckets when the bill has no extracted items', function () {
        $bill = ConcessionaireBill::factory()->create(['extracted_payload' => null]);

        $breakdown = $this->service->handle($bill);

        expect($breakdown['injected_energy']['items'])->toBe([])
            ->and($breakdown['injected_consumption']['items'])->toBe([]);
    });

});
