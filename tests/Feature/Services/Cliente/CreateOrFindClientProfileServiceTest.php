<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use App\Services\Cliente\CreateOrFindClientProfileService;

describe('CreateOrFindClientProfileService', function () {

    beforeEach(function () {
        $this->service = app(CreateOrFindClientProfileService::class);

        $this->consultor = User::factory()->consultor()->create();
        $this->actingAs($this->consultor);
    });

    it('creates a new pf client when cpf does not exist', function () {
        $data = [
            'tipo_pessoa' => 'pf',
            'cpf' => '12345678901',
            'nome' => 'João Teste',
            'celular' => '41999990000',
            'email' => 'joao@example.com',
            'consultor_user_id' => $this->consultor->id,
        ];

        $result = $this->service->handle($data);

        expect($result['created'])->toBeTrue()
            ->and($result['already_exists'])->toBeFalse()
            ->and($result['client_profile'])->toBeInstanceOf(ClientProfile::class)
            ->and($result['client_profile']->nome)->toBe('João Teste')
            ->and($result['client_profile']->tipo_pessoa)->toBe('pf');

        $this->assertDatabaseHas('client_profiles', [
            'tipo_pessoa' => 'pf',
            'cpf' => '12345678901',
            'nome' => 'João Teste',
        ]);
    });

    it('creates a new pj client when cnpj does not exist', function () {
        $data = [
            'tipo_pessoa' => 'pj',
            'cnpj' => '12345678000190',
            'razao_social' => 'Empresa Teste LTDA',
            'nome_fantasia' => 'Fantasia',
            'celular' => '41999990001',
            'email' => 'empresa@example.com',
            'consultor_user_id' => $this->consultor->id,
        ];

        $result = $this->service->handle($data);

        expect($result['created'])->toBeTrue()
            ->and($result['client_profile']->tipo_pessoa)->toBe('pj');

        $this->assertDatabaseHas('client_profiles', [
            'tipo_pessoa' => 'pj',
            'razao_social' => 'Empresa Teste LTDA',
        ]);
    });

    it('reuses existing client when cpf already exists', function () {
        $existing = ClientProfile::factory()->create([
            'tipo_pessoa' => 'pf',
            'cpf' => '12345678901',
            'consultor_user_id' => $this->consultor->id,
        ]);

        $data = [
            'tipo_pessoa' => 'pf',
            'cpf' => '123.456.789-01',
            'nome' => 'Outro Nome',
        ];

        $result = $this->service->handle($data);

        expect($result['created'])->toBeFalse()
            ->and($result['already_exists'])->toBeTrue()
            ->and($result['client_profile']->id)->toBe($existing->id);

        $this->assertDatabaseCount('client_profiles', 1);
    });

    it('throws InvalidArgumentException when cpf is missing for pf', function () {
        $this->expectException(InvalidArgumentException::class);

        $this->service->handle([
            'tipo_pessoa' => 'pf',
            'cpf' => null,
            'nome' => 'Sem CPF',
        ]);
    });

    it('throws InvalidArgumentException when cnpj is missing for pj', function () {
        $this->expectException(InvalidArgumentException::class);

        $this->service->handle([
            'tipo_pessoa' => 'pj',
            'cnpj' => null,
            'razao_social' => 'Empresa',
        ]);
    });

    it('normalizes cpf with formatting before search', function () {
        ClientProfile::factory()->create([
            'tipo_pessoa' => 'pf',
            'cpf' => '12345678901',
            'consultor_user_id' => $this->consultor->id,
        ]);

        $result = $this->service->handle([
            'tipo_pessoa' => 'pf',
            'cpf' => '123.456.789-01',
        ]);

        expect($result['already_exists'])->toBeTrue();
    });

    it('auto-assigns consultor to the authenticated user when not provided', function () {
        $data = [
            'tipo_pessoa' => 'pf',
            'cpf' => '99988877766',
            'nome' => 'Auto Consultor',
        ];

        $result = $this->service->handle($data);

        expect($result['client_profile']->consultor_user_id)->toBe($this->consultor->id);
    });

    it('creates client with default status of prospect', function () {
        $result = $this->service->handle([
            'tipo_pessoa' => 'pf',
            'cpf' => '11122233344',
            'nome' => 'Prospect Test',
        ]);

        expect($result['client_profile']->status)->toBe('prospect');
    });

    it('creates a default discount rule for new client', function () {
        $result = $this->service->handle([
            'tipo_pessoa' => 'pf',
            'cpf' => '55566677788',
            'nome' => 'Com Desconto',
        ]);

        $this->assertDatabaseHas('client_discount_rules', [
            'client_profile_id' => $result['client_profile']->id,
        ]);
    });
});
