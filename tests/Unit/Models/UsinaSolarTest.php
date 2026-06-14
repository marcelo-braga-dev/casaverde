<?php

use App\Models\Usina\UsinaSolar;

describe('UsinaSolar model', function () {

    it('utilization_percentage is 0.0 when no energy is allocated', function () {
        $usina = new UsinaSolar([
            'energia_disponivel_kwh' => 1000.0,
            'energia_alocada_kwh' => 0.0,
        ]);
        expect($usina->utilization_percentage)->toBe(0.0);
    });

    it('utilization_percentage calculates to 50 when half is allocated', function () {
        $usina = new UsinaSolar([
            'energia_disponivel_kwh' => 1000.0,
            'energia_alocada_kwh' => 500.0,
        ]);
        expect($usina->utilization_percentage)->toBe(50.0);
    });

    it('utilization_percentage is 100 when fully allocated', function () {
        $usina = new UsinaSolar([
            'energia_disponivel_kwh' => 1000.0,
            'energia_alocada_kwh' => 1000.0,
        ]);
        expect($usina->utilization_percentage)->toBe(100.0);
    });

    it('utilization_percentage is 0 when energia_disponivel is zero', function () {
        $usina = new UsinaSolar([
            'energia_disponivel_kwh' => 0.0,
            'energia_alocada_kwh' => 0.0,
        ]);
        expect($usina->utilization_percentage)->toBe(0.0);
    });

    it('utilization_percentage rounds to 2 decimal places', function () {
        $usina = new UsinaSolar([
            'energia_disponivel_kwh' => 300.0,
            'energia_alocada_kwh' => 100.0,
        ]);
        // 100/300 * 100 = 33.33...
        expect($usina->utilization_percentage)->toBe(33.33);
    });

    it('remaining_energy_kwh is disponivel minus alocada', function () {
        $usina = new UsinaSolar([
            'energia_disponivel_kwh' => 1000.0,
            'energia_alocada_kwh' => 300.0,
        ]);
        expect($usina->remaining_energy_kwh)->toBe(700.0);
    });

    it('remaining_energy_kwh is never negative', function () {
        $usina = new UsinaSolar([
            'energia_disponivel_kwh' => 500.0,
            'energia_alocada_kwh' => 800.0,
        ]);
        expect($usina->remaining_energy_kwh)->toBe(0.0);
    });

    it('remaining_energy_kwh is zero when usina is fully allocated', function () {
        $usina = new UsinaSolar([
            'energia_disponivel_kwh' => 1000.0,
            'energia_alocada_kwh' => 1000.0,
        ]);
        expect($usina->remaining_energy_kwh)->toBe(0.0);
    });
});
