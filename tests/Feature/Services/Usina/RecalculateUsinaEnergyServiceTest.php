<?php

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Usina\UsinaSolar;
use App\Services\Usina\RecalculateUsinaEnergyService;

describe('RecalculateUsinaEnergyService', function () {

    beforeEach(function () {
        $this->service = app(RecalculateUsinaEnergyService::class);
    });

    it('sets alocada to zero and saldo to disponivel when no active links', function () {
        $usina = UsinaSolar::factory()->comEnergia(1000.0)->create();

        $updated = $this->service->handle($usina);

        expect((float) $updated->energia_alocada_kwh)->toBe(0.0)
            ->and((float) $updated->energia_saldo_kwh)->toBe(1000.0);
    });

    it('sums allocated energy from active links', function () {
        $usina = UsinaSolar::factory()->comEnergia(1000.0)->create();

        ClientUsinaLink::factory()->create([
            'usina_id' => $usina->id,
            'allocated_energy_kwh' => 300.0,
            'is_active' => true,
            'status' => ClientUsinaLinkStatus::Active->value,
        ]);

        ClientUsinaLink::factory()->create([
            'usina_id' => $usina->id,
            'allocated_energy_kwh' => 200.0,
            'is_active' => true,
            'status' => ClientUsinaLinkStatus::Active->value,
        ]);

        $updated = $this->service->handle($usina);

        expect((float) $updated->energia_alocada_kwh)->toBe(500.0)
            ->and((float) $updated->energia_saldo_kwh)->toBe(500.0);
    });

    it('ignores inactive links in allocation sum', function () {
        $usina = UsinaSolar::factory()->comEnergia(1000.0)->create();

        ClientUsinaLink::factory()->create([
            'usina_id' => $usina->id,
            'allocated_energy_kwh' => 400.0,
            'is_active' => false,
            'status' => ClientUsinaLinkStatus::Finished->value,
        ]);

        $updated = $this->service->handle($usina);

        expect((float) $updated->energia_alocada_kwh)->toBe(0.0)
            ->and((float) $updated->energia_saldo_kwh)->toBe(1000.0);
    });

    it('saldo is never negative even when alocada exceeds disponivel', function () {
        $usina = UsinaSolar::factory()->comEnergia(500.0)->create();

        ClientUsinaLink::factory()->create([
            'usina_id' => $usina->id,
            'allocated_energy_kwh' => 600.0,
            'is_active' => true,
            'status' => ClientUsinaLinkStatus::Active->value,
        ]);

        $updated = $this->service->handle($usina);

        expect((float) $updated->energia_saldo_kwh)->toBe(0.0);
    });

    it('persists changes to the database', function () {
        $usina = UsinaSolar::factory()->comEnergia(800.0)->create();

        ClientUsinaLink::factory()->create([
            'usina_id' => $usina->id,
            'allocated_energy_kwh' => 200.0,
            'is_active' => true,
            'status' => ClientUsinaLinkStatus::Active->value,
        ]);

        $this->service->handle($usina);

        $this->assertDatabaseHas('usina_solars', [
            'id' => $usina->id,
            'energia_alocada_kwh' => 200.0,
            'energia_saldo_kwh' => 600.0,
        ]);
    });
});
