<?php

use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;

describe('UsinaSolarPolicy', function () {

    it('allows admin to view and update any usina', function () {
        $admin = User::factory()->admin()->create();
        $usina = UsinaSolar::factory()->create();

        expect($admin->can('view', $usina))->toBeTrue()
            ->and($admin->can('update', $usina))->toBeTrue();
    });

    it('allows a consultor to view and update only their own usina', function () {
        $consultor = User::factory()->consultor()->create();
        $otherConsultor = User::factory()->consultor()->create();

        $ownUsina = UsinaSolar::factory()->create(['consultor_user_id' => $consultor->id]);
        $otherUsina = UsinaSolar::factory()->create(['consultor_user_id' => $otherConsultor->id]);

        expect($consultor->can('view', $ownUsina))->toBeTrue()
            ->and($consultor->can('update', $ownUsina))->toBeTrue()
            ->and($consultor->can('view', $otherUsina))->toBeFalse()
            ->and($consultor->can('update', $otherUsina))->toBeFalse();
    });

    it('allows a producer to view only the usina linked to their own producer profile', function () {
        $producerUser = User::factory()->produtor()->create();
        $producerProfile = ProducerProfile::factory()->create(['platform_user_id' => $producerUser->id]);
        $otherProfile = ProducerProfile::factory()->create();

        $ownUsina = UsinaSolar::factory()->create(['producer_profile_id' => $producerProfile->id]);
        $otherUsina = UsinaSolar::factory()->create(['producer_profile_id' => $otherProfile->id]);

        expect($producerUser->can('view', $ownUsina))->toBeTrue()
            ->and($producerUser->can('view', $otherUsina))->toBeFalse()
            ->and($producerUser->can('update', $ownUsina))->toBeFalse();
    });

});
