<?php

use App\Models\Cliente\ClientAccessInvite;
use Illuminate\Support\Carbon;

describe('ClientAccessInvite model', function () {

    it('isExpired returns true when expires_at is in the past', function () {
        $invite = new ClientAccessInvite([
            'expires_at' => Carbon::now()->subHour(),
        ]);
        expect($invite->isExpired())->toBeTrue();
    });

    it('isExpired returns false when expires_at is in the future', function () {
        $invite = new ClientAccessInvite([
            'expires_at' => Carbon::now()->addHour(),
        ]);
        expect($invite->isExpired())->toBeFalse();
    });

    it('isUsed returns true when used_at is set', function () {
        $invite = new ClientAccessInvite([
            'expires_at' => Carbon::now()->addHour(),
            'used_at'    => Carbon::now(),
        ]);
        expect($invite->isUsed())->toBeTrue();
    });

    it('isUsed returns false when used_at is null', function () {
        $invite = new ClientAccessInvite([
            'expires_at' => Carbon::now()->addHour(),
            'used_at'    => null,
        ]);
        expect($invite->isUsed())->toBeFalse();
    });

    it('canBeUsed returns true when not used and not expired', function () {
        $invite = new ClientAccessInvite([
            'expires_at' => Carbon::now()->addHour(),
            'used_at'    => null,
        ]);
        expect($invite->canBeUsed())->toBeTrue();
    });

    it('canBeUsed returns false when already used', function () {
        $invite = new ClientAccessInvite([
            'expires_at' => Carbon::now()->addHour(),
            'used_at'    => Carbon::now()->subMinute(),
        ]);
        expect($invite->canBeUsed())->toBeFalse();
    });

    it('canBeUsed returns false when expired', function () {
        $invite = new ClientAccessInvite([
            'expires_at' => Carbon::now()->subHour(),
            'used_at'    => null,
        ]);
        expect($invite->canBeUsed())->toBeFalse();
    });
});
