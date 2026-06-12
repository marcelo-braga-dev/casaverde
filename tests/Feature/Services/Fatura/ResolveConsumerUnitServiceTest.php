<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use App\Services\Fatura\ResolveConsumerUnitService;

describe('ResolveConsumerUnitService', function () {

    beforeEach(function () {
        $this->service = app(ResolveConsumerUnitService::class);
    });

    it('returns null when no uc code is informed', function () {
        $client = ClientProfile::factory()->create();

        expect($this->service->handle($client, null))->toBeNull()
            ->and($this->service->handle($client, ''))->toBeNull();
    });

    it('finds an existing consumer unit by its code', function () {
        $client = ClientProfile::factory()->create();
        $unit = ConsumerUnit::factory()->create([
            'client_profile_id' => $client->id,
            'uc_code' => '1234567890',
        ]);

        $resolved = $this->service->handle($client, '1234567890');

        expect($resolved->id)->toBe($unit->id);
    });

    it('normalizes the uc code before matching', function () {
        $client = ClientProfile::factory()->create();
        $unit = ConsumerUnit::factory()->create([
            'client_profile_id' => $client->id,
            'uc_code' => '1234567890',
        ]);

        $resolved = $this->service->handle($client, '12.345-67890');

        expect($resolved->id)->toBe($unit->id);
    });

    it('creates a new consumer unit when no match exists for the client', function () {
        $client = ClientProfile::factory()->create();

        $resolved = $this->service->handle($client, '9988776655');

        expect($resolved)->not->toBeNull()
            ->and($resolved->client_profile_id)->toBe($client->id)
            ->and($resolved->uc_code)->toBe('9988776655')
            ->and($resolved->status)->toBe('active');

        expect(ConsumerUnit::query()
            ->where('client_profile_id', $client->id)
            ->where('uc_code', '9988776655')
            ->exists())->toBeTrue();
    });

    it('does not match a consumer unit belonging to another client', function () {
        $clientA = ClientProfile::factory()->create();
        $clientB = ClientProfile::factory()->create();

        ConsumerUnit::factory()->create([
            'client_profile_id' => $clientA->id,
            'uc_code' => '1112223334',
        ]);

        $resolved = $this->service->handle($clientB, '1112223334');

        expect($resolved->client_profile_id)->toBe($clientB->id);

        expect(ConsumerUnit::query()->where('uc_code', '1112223334')->count())->toBe(2);
    });
});
