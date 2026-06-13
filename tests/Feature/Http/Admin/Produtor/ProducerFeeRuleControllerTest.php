<?php

use App\Models\Produtor\ProducerAdministrationFeeRules;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;

function createProducerProfileWithFeeRule(float $feePercent = 15): ProducerProfile
{
    $producer = ProducerProfile::factory()->create();

    ProducerAdministrationFeeRules::create([
        'producer_profile_id' => $producer->id,
        'fee_percent' => $feePercent,
        'starts_on' => now()->subDay(),
        'ends_on' => null,
        'is_active' => true,
    ]);

    return $producer;
}

describe('ProducerFeeRuleController', function () {

    it('allows an admin to create a new active fee rule, replacing the current one', function () {
        $admin = User::factory()->admin()->create();
        $producer = createProducerProfileWithFeeRule(15);

        $oldRule = $producer->feeRules()->where('is_active', true)->first();

        $this->actingAs($admin)
            ->put(route('consultor.producer.profiles.fee-rule.update', $producer->id), [
                'fee_percent' => 12.5,
                'notes' => 'Renegociado com o produtor',
            ])
            ->assertRedirect();

        $oldRule->refresh();
        expect($oldRule->is_active)->toBeFalse();

        $producer->load('activeFeeRule');
        expect($producer->activeFeeRule)->not->toBeNull();
        expect($producer->activeFeeRule->fee_percent)->toEqual(12.5);
        expect($producer->activeFeeRule->notes)->toBe('Renegociado com o produtor');
        expect($producer->feeRules()->count())->toBe(2);
    });

    it('forbids a consultor from updating the producer fee rule', function () {
        $consultor = User::factory()->consultor()->create();
        $producer = createProducerProfileWithFeeRule(15);

        $this->actingAs($consultor)
            ->put(route('consultor.producer.profiles.fee-rule.update', $producer->id), [
                'fee_percent' => 12.5,
            ])
            ->assertForbidden();
    });

    it('validates fee_percent is required and within range', function () {
        $admin = User::factory()->admin()->create();
        $producer = createProducerProfileWithFeeRule(15);

        $this->actingAs($admin)
            ->put(route('consultor.producer.profiles.fee-rule.update', $producer->id), [
                'fee_percent' => 150,
            ])
            ->assertSessionHasErrors('fee_percent');
    });
});
