<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;

describe('ClientUsinaLinkController', function () {

    beforeEach(function () {
        $this->admin = User::factory()->admin()->create();
        $this->client = ClientProfile::factory()->create();
        $this->consumerUnit = ConsumerUnit::factory()->create([
            'client_profile_id' => $this->client->id,
            'consumo_previsto_kwh_mes' => 500,
        ]);
        $this->usinaA = UsinaSolar::factory()->create();
        $this->usinaB = UsinaSolar::factory()->create();
    });

    it('attaches a UC to a usina defaulting to 100% allocation', function () {
        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.usina.store', $this->client->id), [
                'consumer_unit_id' => $this->consumerUnit->id,
                'usina_id' => $this->usinaA->id,
                'started_at' => now()->toDateTimeString(),
                'consumption_percentage' => 100,
            ])
            ->assertRedirect();

        $link = ClientUsinaLink::query()
            ->where('consumer_unit_id', $this->consumerUnit->id)
            ->where('usina_id', $this->usinaA->id)
            ->first();

        expect($link)->not->toBeNull()
            ->and($link->is_active)->toBeTrue()
            ->and((float) $link->consumption_percentage)->toBe(100.0);
    });

    it('requires consumption_percentage', function () {
        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.usina.store', $this->client->id), [
                'consumer_unit_id' => $this->consumerUnit->id,
                'usina_id' => $this->usinaA->id,
                'started_at' => now()->toDateTimeString(),
            ])
            ->assertSessionHasErrors('consumption_percentage');
    });

    it('allows splitting a UC allocation across multiple usinas without exceeding 100%', function () {
        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.usina.store', $this->client->id), [
                'consumer_unit_id' => $this->consumerUnit->id,
                'usina_id' => $this->usinaA->id,
                'started_at' => now()->toDateTimeString(),
                'consumption_percentage' => 60,
            ])
            ->assertRedirect();

        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.usina.store', $this->client->id), [
                'consumer_unit_id' => $this->consumerUnit->id,
                'usina_id' => $this->usinaB->id,
                'started_at' => now()->toDateTimeString(),
                'consumption_percentage' => 40,
            ])
            ->assertRedirect();

        $activeLinks = ClientUsinaLink::query()
            ->where('consumer_unit_id', $this->consumerUnit->id)
            ->active()
            ->get();

        expect($activeLinks)->toHaveCount(2)
            ->and((float) $activeLinks->sum('consumption_percentage'))->toBe(100.0);
    });

    it('rejects an allocation that would push the total above 100%', function () {
        ClientUsinaLink::factory()->create([
            'client_profile_id' => $this->client->id,
            'consumer_unit_id' => $this->consumerUnit->id,
            'usina_id' => $this->usinaA->id,
            'is_active' => true,
            'consumption_percentage' => 60,
        ]);

        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.usina.store', $this->client->id), [
                'consumer_unit_id' => $this->consumerUnit->id,
                'usina_id' => $this->usinaB->id,
                'started_at' => now()->toDateTimeString(),
                'consumption_percentage' => 50,
            ])
            ->assertSessionHasErrors('consumption_percentage');

        expect(ClientUsinaLink::query()
            ->where('consumer_unit_id', $this->consumerUnit->id)
            ->where('usina_id', $this->usinaB->id)
            ->exists())->toBeFalse();
    });

    it('replaces the existing allocation when re-linking the same UC to the same usina', function () {
        $oldLink = ClientUsinaLink::factory()->create([
            'client_profile_id' => $this->client->id,
            'consumer_unit_id' => $this->consumerUnit->id,
            'usina_id' => $this->usinaA->id,
            'is_active' => true,
            'consumption_percentage' => 60,
        ]);

        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.usina.store', $this->client->id), [
                'consumer_unit_id' => $this->consumerUnit->id,
                'usina_id' => $this->usinaA->id,
                'started_at' => now()->toDateTimeString(),
                'consumption_percentage' => 80,
            ])
            ->assertRedirect();

        $oldLink->refresh();
        expect($oldLink->is_active)->toBeFalse();

        $newLink = ClientUsinaLink::query()
            ->where('consumer_unit_id', $this->consumerUnit->id)
            ->where('usina_id', $this->usinaA->id)
            ->where('is_active', true)
            ->first();

        expect((float) $newLink->consumption_percentage)->toBe(80.0);
    });

    it('preserves the legacy behaviour when no consumer unit is informed', function () {
        $oldLink = ClientUsinaLink::factory()->create([
            'client_profile_id' => $this->client->id,
            'consumer_unit_id' => null,
            'usina_id' => $this->usinaA->id,
            'is_active' => true,
        ]);

        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.usina.store', $this->client->id), [
                'usina_id' => $this->usinaB->id,
                'started_at' => now()->toDateTimeString(),
                'consumption_percentage' => 100,
            ])
            ->assertRedirect();

        $oldLink->refresh();
        expect($oldLink->is_active)->toBeFalse();

        expect(ClientUsinaLink::query()
            ->where('client_profile_id', $this->client->id)
            ->where('usina_id', $this->usinaB->id)
            ->where('is_active', true)
            ->exists())->toBeTrue();
    });
});
