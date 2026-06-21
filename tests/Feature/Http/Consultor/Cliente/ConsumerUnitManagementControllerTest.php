<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;

function validManagementUcAddressPayload(): array
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

describe('ConsumerUnitManagementController', function () {

    it('lists consumer units for admin', function () {
        $admin = User::factory()->admin()->create();

        ConsumerUnit::factory()->count(2)->create();

        $this->actingAs($admin)
            ->get(route('consultor.cliente.consumer-units.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Consultor/Cliente/ConsumerUnit/Index/Page')
                ->has('consumerUnits.data', 2)
            );
    });

    it('scopes the index to the consultor own clients', function () {
        $consultor = User::factory()->consultor()->create();
        $other = User::factory()->consultor()->create();

        $ownClient = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        $otherClient = ClientProfile::factory()->create(['consultor_user_id' => $other->id]);

        ConsumerUnit::factory()->create(['client_profile_id' => $ownClient->id]);
        ConsumerUnit::factory()->create(['client_profile_id' => $otherClient->id]);

        $this->actingAs($consultor)
            ->get(route('consultor.cliente.consumer-units.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('consumerUnits.data', 1)
            );
    });

    it('renders the create page with clients and concessionarias', function () {
        $consultor = User::factory()->consultor()->create();

        ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        Concessionaria::factory()->create(['status' => 'ativo']);

        $this->actingAs($consultor)
            ->get(route('consultor.cliente.consumer-units.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Consultor/Cliente/ConsumerUnit/Create/Page')
                ->has('clients', 1)
                ->has('concessionarias', 1)
            );
    });

    it('creates a consumer unit requiring consumo_previsto_kwh_mes', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);

        $this->actingAs($consultor)
            ->post(route('consultor.cliente.consumer-units.store'), [
                'client_profile_id' => $client->id,
                'uc_code' => '987654321',
                'label' => 'Sede',
                'consumo_previsto_kwh_mes' => 320.5,
                'status' => 'active',
                'address' => validManagementUcAddressPayload(),
            ])
            ->assertRedirect();

        $consumerUnit = ConsumerUnit::query()
            ->where('client_profile_id', $client->id)
            ->where('uc_code', '987654321')
            ->first();

        expect($consumerUnit)->not->toBeNull();
        expect((float) $consumerUnit->consumo_previsto_kwh_mes)->toEqual(320.5);
        expect($consumerUnit->address_id)->not->toBeNull();
        expect($consumerUnit->address->cidade)->toBe('São Paulo');
    });

    it('rejects creating a consumer unit without an address', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);

        $this->actingAs($consultor)
            ->post(route('consultor.cliente.consumer-units.store'), [
                'client_profile_id' => $client->id,
                'uc_code' => '444555666',
                'consumo_previsto_kwh_mes' => 100,
                'status' => 'active',
            ])
            ->assertSessionHasErrors('address');

        expect(ConsumerUnit::query()->where('uc_code', '444555666')->exists())->toBeFalse();
    });

    it('rejects creating a consumer unit without consumo_previsto_kwh_mes', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);

        $this->actingAs($consultor)
            ->post(route('consultor.cliente.consumer-units.store'), [
                'client_profile_id' => $client->id,
                'uc_code' => '111222333',
                'status' => 'active',
            ])
            ->assertSessionHasErrors('consumo_previsto_kwh_mes');

        expect(ConsumerUnit::query()->where('uc_code', '111222333')->exists())->toBeFalse();
    });

    it('rejects a duplicate uc_code for the same client', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);

        ConsumerUnit::factory()->create([
            'client_profile_id' => $client->id,
            'uc_code' => '555555555',
        ]);

        $this->actingAs($consultor)
            ->post(route('consultor.cliente.consumer-units.store'), [
                'client_profile_id' => $client->id,
                'uc_code' => '555555555',
                'consumo_previsto_kwh_mes' => 100,
                'status' => 'active',
                'address' => validManagementUcAddressPayload(),
            ])
            ->assertSessionHasErrors('uc_code');
    });

    it('shows a consumer unit with its active usina allocation but no bills for a consultor', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);

        $consumerUnit = ConsumerUnit::factory()->create([
            'client_profile_id' => $client->id,
            'consumo_previsto_kwh_mes' => 450,
        ]);

        $link = ClientUsinaLink::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $consumerUnit->id,
        ]);

        ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $consumerUnit->id,
        ]);

        $this->actingAs($consultor)
            ->get(route('consultor.cliente.consumer-units.show', $consumerUnit->id))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Consultor/Cliente/ConsumerUnit/Show/Page')
                ->where('consumerUnit.id', $consumerUnit->id)
                ->where('consumerUnit.consumo_previsto_kwh_mes', '450.00')
                ->where('consumerUnit.active_usina_link.id', $link->id)
                ->where('bills', null)
            );
    });

    it('shows bills to an admin on the same consumer unit page', function () {
        $admin = User::factory()->admin()->create();
        $client = ClientProfile::factory()->create();

        $consumerUnit = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);

        ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $consumerUnit->id,
        ]);

        $this->actingAs($admin)
            ->get(route('consultor.cliente.consumer-units.show', $consumerUnit->id))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('bills.data', 1));
    });

    it('denies a consultor from viewing another consultor client consumer unit', function () {
        $consultor = User::factory()->consultor()->create();
        $other = User::factory()->consultor()->create();

        $otherClient = ClientProfile::factory()->create(['consultor_user_id' => $other->id]);
        $consumerUnit = ConsumerUnit::factory()->create(['client_profile_id' => $otherClient->id]);

        $this->actingAs($consultor)
            ->get(route('consultor.cliente.consumer-units.show', $consumerUnit->id))
            ->assertForbidden();
    });

    it('renders the edit page', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        $consumerUnit = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);

        $this->actingAs($consultor)
            ->get(route('consultor.cliente.consumer-units.edit', $consumerUnit->id))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Consultor/Cliente/ConsumerUnit/Edit/Page')
                ->where('consumerUnit.id', $consumerUnit->id)
            );
    });

    it('updates a consumer unit', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        $consumerUnit = ConsumerUnit::factory()->create([
            'client_profile_id' => $client->id,
            'consumo_previsto_kwh_mes' => 100,
        ]);

        $this->actingAs($consultor)
            ->put(route('consultor.cliente.consumer-units.update', $consumerUnit->id), [
                'client_profile_id' => $client->id,
                'uc_code' => $consumerUnit->uc_code,
                'label' => 'Novo rótulo',
                'consumo_previsto_kwh_mes' => 777.25,
                'status' => 'active',
                'address' => validManagementUcAddressPayload(),
            ])
            ->assertRedirect();

        $consumerUnit->refresh();

        expect($consumerUnit->label)->toBe('Novo rótulo');
        expect((float) $consumerUnit->consumo_previsto_kwh_mes)->toEqual(777.25);
        expect($consumerUnit->address_id)->not->toBeNull();
        expect($consumerUnit->address->cidade)->toBe('São Paulo');
    });

    it('destroys a consumer unit without active usina links', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        $consumerUnit = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);

        $this->actingAs($consultor)
            ->delete(route('consultor.cliente.consumer-units.destroy', $consumerUnit->id))
            ->assertRedirect(route('consultor.cliente.consumer-units.index'));

        expect(ConsumerUnit::query()->find($consumerUnit->id))->toBeNull();
    });

    it('blocks destroy when the consumer unit has an active usina link', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        $consumerUnit = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);

        ClientUsinaLink::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $consumerUnit->id,
            'is_active' => true,
        ]);

        $this->actingAs($consultor)
            ->delete(route('consultor.cliente.consumer-units.destroy', $consumerUnit->id))
            ->assertSessionHasErrors('uc');

        expect(ConsumerUnit::query()->find($consumerUnit->id))->not->toBeNull();
    });
});
