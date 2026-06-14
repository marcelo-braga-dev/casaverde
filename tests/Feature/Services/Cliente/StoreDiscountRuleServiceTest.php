<?php

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use App\Services\Cliente\StoreDiscountRuleService;

describe('StoreDiscountRuleService', function () {

    beforeEach(function () {
        $this->service = app(StoreDiscountRuleService::class);
        $this->client = ClientProfile::factory()->create();
    });

    it('creates a discount rule for the client', function () {
        $rule = $this->service->handle(
            clientProfile: $this->client,
            discountPercent: 20.0,
            startsOn: now()->toDateTimeString(),
        );

        expect($rule)->toBeInstanceOf(ClientDiscountRule::class)
            ->and($rule->client_profile_id)->toBe($this->client->id)
            ->and((float) $rule->discount_percent)->toBe(20.0);

        $this->assertDatabaseHas('client_discount_rules', [
            'client_profile_id' => $this->client->id,
            'discount_percent' => 20.0,
        ]);
    });

    it('creates rule with optional ends_on date', function () {
        $endsOn = now()->addYear()->toDateTimeString();

        $rule = $this->service->handle(
            clientProfile: $this->client,
            discountPercent: 10.0,
            startsOn: now()->toDateTimeString(),
            endsOn: $endsOn,
        );

        expect($rule->ends_on)->not()->toBeNull();
    });

    it('creates rule with optional notes', function () {
        $rule = $this->service->handle(
            clientProfile: $this->client,
            discountPercent: 15.0,
            startsOn: now()->toDateTimeString(),
            endsOn: null,
            notes: 'Desconto especial',
        );

        expect($rule->notes)->toBe('Desconto especial');
    });

    it('activates rule if starts_on is current or past', function () {
        $this->service->handle(
            clientProfile: $this->client,
            discountPercent: 25.0,
            startsOn: now()->subDay()->toDateTimeString(),
        );

        $active = $this->client->activeDiscountRule;
        expect($active)->not()->toBeNull()
            ->and((float) $active->discount_percent)->toBe(25.0);
    });

    it('does not activate rule if starts_on is in the future', function () {
        $this->service->handle(
            clientProfile: $this->client,
            discountPercent: 30.0,
            startsOn: now()->addDay()->toDateTimeString(),
        );

        $active = $this->client->activeDiscountRule()->first();
        expect($active)->toBeNull();
    });
});
