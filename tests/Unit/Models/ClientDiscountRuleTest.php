<?php

use App\Models\Cliente\ClientDiscountRule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

describe('ClientDiscountRule model', function () {

    it('isCurrentlyActive returns false when starts_on is null', function () {
        $rule = new ClientDiscountRule([
            'starts_on' => null,
            'ends_on' => null,
        ]);
        expect($rule->isCurrentlyActive())->toBeFalse();
    });

    it('isCurrentlyActive returns true when starts_on is in past and ends_on is null', function () {
        $rule = new ClientDiscountRule([
            'starts_on' => Carbon::now()->subDay()->toDateTimeString(),
            'ends_on' => null,
        ]);
        expect($rule->isCurrentlyActive())->toBeTrue();
    });

    it('isCurrentlyActive returns true when within date range', function () {
        $rule = new ClientDiscountRule([
            'starts_on' => Carbon::now()->subDay()->toDateTimeString(),
            'ends_on' => Carbon::now()->addDay()->toDateTimeString(),
        ]);
        expect($rule->isCurrentlyActive())->toBeTrue();
    });

    it('isCurrentlyActive returns false when ends_on is in the past', function () {
        $rule = new ClientDiscountRule([
            'starts_on' => Carbon::now()->subMonth()->toDateTimeString(),
            'ends_on' => Carbon::now()->subDay()->toDateTimeString(),
        ]);
        expect($rule->isCurrentlyActive())->toBeFalse();
    });

    it('isCurrentlyActive returns false when starts_on is in the future', function () {
        $rule = new ClientDiscountRule([
            'starts_on' => Carbon::now()->addDay()->toDateTimeString(),
            'ends_on' => null,
        ]);
        expect($rule->isCurrentlyActive())->toBeFalse();
    });
});
