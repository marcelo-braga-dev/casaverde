<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;

describe('CustomerChargePolicy', function () {

    it('allows admin to view and update any charge', function () {
        $admin = User::factory()->admin()->create();
        $charge = CustomerCharge::factory()->create();

        expect($admin->can('view', $charge))->toBeTrue()
            ->and($admin->can('update', $charge))->toBeTrue();
    });

    it('allows a consultor to view and update only charges of their own clients', function () {
        $consultor = User::factory()->consultor()->create();
        $otherConsultor = User::factory()->consultor()->create();

        $ownClient = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        $otherClient = ClientProfile::factory()->create(['consultor_user_id' => $otherConsultor->id]);

        $ownCharge = CustomerCharge::factory()->create(['client_profile_id' => $ownClient->id]);
        $otherCharge = CustomerCharge::factory()->create(['client_profile_id' => $otherClient->id]);

        expect($consultor->can('view', $ownCharge))->toBeTrue()
            ->and($consultor->can('update', $ownCharge))->toBeTrue()
            ->and($consultor->can('view', $otherCharge))->toBeFalse()
            ->and($consultor->can('update', $otherCharge))->toBeFalse();
    });

    it('allows a client to view only their own charge, never update it', function () {
        $clientUser = User::factory()->cliente()->create();
        $client = ClientProfile::factory()->create(['platform_user_id' => $clientUser->id]);
        $otherClient = ClientProfile::factory()->create();

        $ownCharge = CustomerCharge::factory()->create(['client_profile_id' => $client->id]);
        $otherCharge = CustomerCharge::factory()->create(['client_profile_id' => $otherClient->id]);

        expect($clientUser->can('view', $ownCharge))->toBeTrue()
            ->and($clientUser->can('view', $otherCharge))->toBeFalse()
            ->and($clientUser->can('update', $ownCharge))->toBeFalse();
    });

});
