<?php

use App\Services\Fatura\CopelBillParserService;

describe('CopelBillParserService', function () {

    beforeEach(function () {
        $this->service = app(CopelBillParserService::class);
    });

    it('parses header fields and injected energy totals from a Copel bill', function () {
        $rawText = <<<'TEXT'
Nome: DANILO GOMES DE PAULA
Endereço: R Aracaju, 485 - Qd17 Lt14a - Aparecida 54165822
05/2026 20/06/2026 R$796,17
ENERGIA ELET CONSUMO kWh 2.716 0,367931 999,30 60,50 189,87 0,275750
ENERGIA ELET USO SISTEMA kWh 2.716 0,489245 1.328,79 80,45 252,47 0,366670
ENERGIA INJETADA TE 05/2026 GDI-I kWh -682 0,298035 -203,26 -15,19 0,00 0,275750
ENERGIA INJETADA TUSD 05/2026 GDI-I kWh -682 0,396276 -270,26 -20,20 0,00 0,366670
ENERGIA INJ. OUC MPT TE 08/2025 GDII-II kWh -168 0,275714 -46,32 0,00 0,00 0,275750
ENERGIA INJ. OUC MPT TUS 08/2025 GDII-II kWh -168 0,271131 -45,55 0,00 0,00 0,271189
ENERGIA INJ. OUC MPT TE 05/2026 GDI-I kWh -166 0,275723 -45,77 0,00 0,00 0,275750
ENERGIA INJ. OUC MPT TUSD 05/2026 GDI-I kWh -166 0,366627 -60,86 0,00 0,00 0,366670
ENERGIA INJ. OUC MPT TE 05/2026 GDII-II kWh -1.700 0,275747 -468,77 0,00 0,00 0,275750
ENERGIA INJ. OUC MPT TUS 05/2026 GDII-II kWh -1.700 0,271188 -461,02 0,00 0,00 0,271189
ENERGIA CONS. B.AMARELA kWh 963,74 0,025131 24,22 1,46 4,60 0,018850
ENERGIA INJ. BAND. AMARELA TE kWh -963,74 0,020358 -19,62 -1,46 0,00 0,018850
CONT ILUMIN PUBLICA MUNICIPIO UN 65,290000 65,29
TOTAL 796,17 105,56 446,94
0403072862 CONSUMO kWh TP 58358 61074 1 2716
TEXT;

        $parsed = $this->service->parse($rawText);

        expect($parsed['nome'])->toBe('DANILO GOMES DE PAULA');
        expect($parsed['unidade_consumidora'])->toBe('54165822');
        expect($parsed['vencimento'])->toBe('2026-06-20');
        expect($parsed['valor_total'])->toBe(796.17);
        expect($parsed['consumo_kwh'])->toBe(2716.0);

        expect($parsed['injected_energy_kwh'])->toBe(-2034.0);
        expect($parsed['injected_energy_amount'])->toBe(-560.86);
        expect($parsed['injected_consumption_kwh'])->toBe(-5031.74);
        expect($parsed['injected_consumption_amount'])->toBe(-1147.91);
    });

});
