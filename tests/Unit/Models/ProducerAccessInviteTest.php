<?php

use App\Models\Produtor\ProducerAccessInvite;
use Illuminate\Support\Carbon;
use Tests\TestCase;

uses(TestCase::class);

describe('ProducerAccessInvite model', function () {

    it('canBeUsed returns true when not used and not expired', function () {
        $invite = new ProducerAccessInvite(['expires_at' => Carbon::now()->addHour()]);

        expect($invite->canBeUsed())->toBeTrue();
    });

    it('canBeUsed returns false when expired', function () {
        $invite = new ProducerAccessInvite(['expires_at' => Carbon::now()->subMinute()]);

        expect($invite->canBeUsed())->toBeFalse();
    });

    it('canBeUsed returns false when already used', function () {
        $invite = new ProducerAccessInvite([
            'expires_at' => Carbon::now()->addHour(),
            'used_at' => Carbon::now(),
        ]);

        expect($invite->canBeUsed())->toBeFalse();
    });

    it('canBeUsed returns false when expires_at is missing', function () {
        $invite = new ProducerAccessInvite(['expires_at' => null]);

        expect($invite->canBeUsed())->toBeFalse();
    });
});
