<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;

function validUcAddressPayload(): array
{
    return [
        'cep' => '01310-100',
        'rua' => 'Av. Paulista',
        'numero' => '1000',
        'bairro' => 'Bela Vista',
        'cidade' => 'São Paulo',
        'estado' => 'SP',
    ];
}

describe('ConsumerUnitController', function () {

    it('allows registering a UC for a client', function () {
        $admin = User::factory()->admin()->create();
        $client = ClientProfile::factory()->create();
        $concessionaria = Concessionaria::factory()->create();

        $this->actingAs($admin)
            ->post(route('consultor.user.cliente.consumer-unit.store', $client->id), [
                'uc_code' => '1234567890',
                'concessionaria_id' => $concessionaria->id,
                'consumo_previsto_kwh_mes' => 150.5,
                'address' => validUcAddressPayload(),
            ])
            ->assertRedirect();

        expect(ConsumerUnit::query()
            ->where('client_profile_id', $client->id)
            ->where('uc_code', '1234567890')
            ->where('concessionaria_id', $concessionaria->id)
            ->exists())->toBeTrue();

        $consumerUnit = ConsumerUnit::query()
            ->where('client_profile_id', $client->id)
            ->where('uc_code', '1234567890')
            ->first();

        expect($consumerUnit->address_id)->not->toBeNull();
        expect($consumerUnit->address->cidade)->toBe('São Paulo');
    });

    it('rejects a UC code already registered for another client in the same concessionaria', function () {
        $admin = User::factory()->admin()->create();
        $concessionaria = Concessionaria::factory()->create();

        $clientA = ClientProfile::factory()->create();
        $clientB = ClientProfile::factory()->create();

        ConsumerUnit::factory()->create([
            'client_profile_id' => $clientA->id,
            'uc_code' => '76069052',
            'concessionaria_id' => $concessionaria->id,
        ]);

        $this->actingAs($admin)
            ->post(route('consultor.user.cliente.consumer-unit.store', $clientB->id), [
                'uc_code' => '76069052',
                'concessionaria_id' => $concessionaria->id,
                'consumo_previsto_kwh_mes' => 150.5,
                'address' => validUcAddressPayload(),
            ])
            ->assertSessionHasErrors('uc_code');

        expect(ConsumerUnit::query()
            ->where('client_profile_id', $clientB->id)
            ->where('uc_code', '76069052')
            ->exists())->toBeFalse();
    });

    it('allows the same UC code for different concessionarias', function () {
        $admin = User::factory()->admin()->create();
        $concessionariaA = Concessionaria::factory()->create();
        $concessionariaB = Concessionaria::factory()->create();

        $clientA = ClientProfile::factory()->create();
        $clientB = ClientProfile::factory()->create();

        ConsumerUnit::factory()->create([
            'client_profile_id' => $clientA->id,
            'uc_code' => '76069052',
            'concessionaria_id' => $concessionariaA->id,
        ]);

        $this->actingAs($admin)
            ->post(route('consultor.user.cliente.consumer-unit.store', $clientB->id), [
                'uc_code' => '76069052',
                'concessionaria_id' => $concessionariaB->id,
                'consumo_previsto_kwh_mes' => 150.5,
                'address' => validUcAddressPayload(),
            ])
            ->assertRedirect();

        expect(ConsumerUnit::query()
            ->where('client_profile_id', $clientB->id)
            ->where('uc_code', '76069052')
            ->where('concessionaria_id', $concessionariaB->id)
            ->exists())->toBeTrue();
    });

    it('rejects updating a UC to a code already used by another client in the same concessionaria', function () {
        $admin = User::factory()->admin()->create();
        $concessionaria = Concessionaria::factory()->create();

        $clientA = ClientProfile::factory()->create();
        $clientB = ClientProfile::factory()->create();

        ConsumerUnit::factory()->create([
            'client_profile_id' => $clientA->id,
            'uc_code' => '76069052',
            'concessionaria_id' => $concessionaria->id,
        ]);

        $unitB = ConsumerUnit::factory()->create([
            'client_profile_id' => $clientB->id,
            'uc_code' => '12345',
            'concessionaria_id' => $concessionaria->id,
        ]);

        $this->actingAs($admin)
            ->put(route('consultor.user.cliente.consumer-unit.update', [$clientB->id, $unitB->id]), [
                'uc_code' => '76069052',
                'concessionaria_id' => $concessionaria->id,
                'consumo_previsto_kwh_mes' => 150.5,
                'address' => validUcAddressPayload(),
            ])
            ->assertSessionHasErrors('uc_code');

        expect($unitB->refresh()->uc_code)->toBe('12345');
    });
});
