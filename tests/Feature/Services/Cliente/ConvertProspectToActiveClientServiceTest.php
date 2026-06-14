<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use App\Services\Cliente\ConvertProspectToActiveClientService;

describe('ConvertProspectToActiveClientService', function () {

    beforeEach(function () {
        $this->service = app(ConvertProspectToActiveClientService::class);
        $this->consultor = User::factory()->consultor()->create();
    });

    it('converts a prospect client to active (contrato_assinado)', function () {
        $client = ClientProfile::factory()->prospect()->create([
            'consultor_user_id' => $this->consultor->id,
        ]);

        $updated = $this->service->handle($client);

        expect($updated->status)->toBe('contrato_assinado')
            ->and($updated->is_active_client)->toBeTrue();

        $this->assertDatabaseHas('client_profiles', [
            'id' => $client->id,
            'status' => 'contrato_assinado',
            'is_active_client' => true,
        ]);
    });

    it('throws InvalidArgumentException when client has no consultor', function () {
        $client = ClientProfile::factory()->prospect()->create([
            'consultor_user_id' => null,
        ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('consultor responsável');

        $this->service->handle($client);
    });

    it('returns a fresh client profile after conversion', function () {
        $client = ClientProfile::factory()->prospect()->create([
            'consultor_user_id' => $this->consultor->id,
        ]);

        $updated = $this->service->handle($client);

        expect($updated)->toBeInstanceOf(ClientProfile::class)
            ->and($updated->id)->toBe($client->id);
    });

    it('allows converting a client that is already active (idempotent update)', function () {
        $client = ClientProfile::factory()->active()->create([
            'consultor_user_id' => $this->consultor->id,
        ]);

        $updated = $this->service->handle($client);

        expect($updated->status)->toBe('contrato_assinado')
            ->and($updated->is_active_client)->toBeTrue();
    });
});
