<?php

use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;

describe('ProducerProfilePolicy', function () {

    it('allows admin to view, update and delete any producer profile', function () {
        $admin = User::factory()->admin()->create();
        $producer = ProducerProfile::factory()->create();

        expect($admin->can('view', $producer))->toBeTrue()
            ->and($admin->can('update', $producer))->toBeTrue()
            ->and($admin->can('delete', $producer))->toBeTrue();
    });

    it('allows a consultor to manage only their own producer profiles', function () {
        $consultor = User::factory()->consultor()->create();
        $otherConsultor = User::factory()->consultor()->create();

        $ownProfile = ProducerProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        $otherProfile = ProducerProfile::factory()->create(['consultor_user_id' => $otherConsultor->id]);

        expect($consultor->can('view', $ownProfile))->toBeTrue()
            ->and($consultor->can('update', $ownProfile))->toBeTrue()
            ->and($consultor->can('delete', $ownProfile))->toBeTrue()
            ->and($consultor->can('view', $otherProfile))->toBeFalse()
            ->and($consultor->can('update', $otherProfile))->toBeFalse()
            ->and($consultor->can('delete', $otherProfile))->toBeFalse();
    });

    it('allows a producer to view only their own profile and never update/delete it', function () {
        $producerUser = User::factory()->produtor()->create();
        $ownProfile = ProducerProfile::factory()->create(['platform_user_id' => $producerUser->id]);
        $otherProfile = ProducerProfile::factory()->create();

        expect($producerUser->can('view', $ownProfile))->toBeTrue()
            ->and($producerUser->can('view', $otherProfile))->toBeFalse()
            ->and($producerUser->can('update', $ownProfile))->toBeFalse()
            ->and($producerUser->can('delete', $ownProfile))->toBeFalse();
    });

});
