<?php

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;
use App\Services\Usina\SyncClientUsinaLinkService;

describe('SyncClientUsinaLinkService', function () {

    beforeEach(function () {
        $this->service = app(SyncClientUsinaLinkService::class);
        $this->admin   = User::factory()->admin()->create();
        $this->actingAs($this->admin);

        $this->usina  = UsinaSolar::factory()->comEnergia(1000.0)->create();
        $this->client = ClientProfile::factory()->create();
    });

    // ── create ────────────────────────────────────────────────────────────

    it('creates an active usina link when energy is available', function () {
        $link = $this->service->create([
            'usina_id'             => $this->usina->id,
            'client_profile_id'    => $this->client->id,
            'allocated_energy_kwh' => 300.0,
            'discount_percentage'  => 15.0,
            'started_at'           => now()->toDateTimeString(),
            'is_active'            => true,
            'status'               => ClientUsinaLinkStatus::Active->value,
        ]);

        expect($link)->toBeInstanceOf(ClientUsinaLink::class)
            ->and($link->is_active)->toBeTrue()
            ->and((float) $link->allocated_energy_kwh)->toBe(300.0);
    });

    it('recalculates usina energy after creating a link', function () {
        $this->service->create([
            'usina_id'             => $this->usina->id,
            'client_profile_id'    => $this->client->id,
            'allocated_energy_kwh' => 400.0,
            'discount_percentage'  => 0.0,
            'started_at'           => now()->toDateTimeString(),
            'is_active'            => true,
            'status'               => ClientUsinaLinkStatus::Active->value,
        ]);

        $this->usina->refresh();

        expect((float) $this->usina->energia_alocada_kwh)->toBe(400.0)
            ->and((float) $this->usina->energia_saldo_kwh)->toBe(600.0);
    });

    it('throws RuntimeException when requested energy exceeds available', function () {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('excede o saldo disponível');

        $this->service->create([
            'usina_id'             => $this->usina->id,
            'client_profile_id'    => $this->client->id,
            'allocated_energy_kwh' => 1500.0,
            'discount_percentage'  => 0.0,
            'started_at'           => now()->toDateTimeString(),
            'is_active'            => true,
            'status'               => ClientUsinaLinkStatus::Active->value,
        ]);
    });

    it('deactivates previous active link for same client when creating new one', function () {
        $oldLink = ClientUsinaLink::factory()->create([
            'usina_id'             => $this->usina->id,
            'client_profile_id'    => $this->client->id,
            'allocated_energy_kwh' => 100.0,
            'is_active'            => true,
            'status'               => ClientUsinaLinkStatus::Active->value,
        ]);

        $this->service->create([
            'usina_id'             => $this->usina->id,
            'client_profile_id'    => $this->client->id,
            'allocated_energy_kwh' => 200.0,
            'discount_percentage'  => 0.0,
            'started_at'           => now()->toDateTimeString(),
            'is_active'            => true,
            'status'               => ClientUsinaLinkStatus::Active->value,
        ]);

        $oldLink->refresh();
        expect($oldLink->is_active)->toBeFalse()
            ->and($oldLink->status)->toBe(ClientUsinaLinkStatus::Finished->value);
    });

    it('does not create link when transaction fails due to insufficient energy', function () {
        try {
            $this->service->create([
                'usina_id'             => $this->usina->id,
                'client_profile_id'    => $this->client->id,
                'allocated_energy_kwh' => 9999.0,
                'discount_percentage'  => 0.0,
                'started_at'           => now()->toDateTimeString(),
                'is_active'            => true,
                'status'               => ClientUsinaLinkStatus::Active->value,
            ]);
        } catch (\RuntimeException) {
            // expected
        }

        $this->assertDatabaseCount('client_usina_links', 0);
    });

    // ── cancel ───────────────────────────────────────────────────────────

    it('cancels an active link', function () {
        $link = ClientUsinaLink::factory()->create([
            'usina_id'             => $this->usina->id,
            'client_profile_id'    => $this->client->id,
            'allocated_energy_kwh' => 300.0,
            'is_active'            => true,
            'status'               => ClientUsinaLinkStatus::Active->value,
        ]);

        $this->service->cancel($link);

        $link->refresh();
        expect($link->is_active)->toBeFalse()
            ->and($link->status)->toBe(ClientUsinaLinkStatus::Cancelled->value);
    });

    it('recalculates usina energy after cancellation', function () {
        $link = ClientUsinaLink::factory()->create([
            'usina_id'             => $this->usina->id,
            'client_profile_id'    => $this->client->id,
            'allocated_energy_kwh' => 500.0,
            'is_active'            => true,
            'status'               => ClientUsinaLinkStatus::Active->value,
        ]);

        // Manually set alocada to simulate state before cancel
        $this->usina->update(['energia_alocada_kwh' => 500.0, 'energia_saldo_kwh' => 500.0]);

        $this->service->cancel($link);

        $this->usina->refresh();
        expect((float) $this->usina->energia_alocada_kwh)->toBe(0.0);
    });
});
