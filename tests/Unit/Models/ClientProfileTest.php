<?php

use App\Models\Cliente\ClientProfile;

describe('ClientProfile model', function () {

    it('normalizes cpf by removing non-numeric characters', function () {
        $result = ClientProfile::normalizeDocument('123.456.789-00');
        expect($result)->toBe('12345678900');
    });

    it('normalizes cnpj by removing non-numeric characters', function () {
        $result = ClientProfile::normalizeDocument('12.345.678/0001-90');
        expect($result)->toBe('12345678000190');
    });

    it('returns null when normalizing null document', function () {
        expect(ClientProfile::normalizeDocument(null))->toBeNull();
    });

    it('returns null when normalizing empty string', function () {
        expect(ClientProfile::normalizeDocument(''))->toBeNull();
    });

    it('generates client code in C### format', function () {
        $code = ClientProfile::generateClientCode();
        expect($code)->toMatch('/^C\d{3}$/');
    });

    it('isProspect returns true for prospect status', function () {
        $client = new ClientProfile(['status' => 'prospect']);
        expect($client->isProspect())->toBeTrue();
    });

    it('isProspect returns true for proposta_emitida status', function () {
        $client = new ClientProfile(['status' => 'proposta_emitida']);
        expect($client->isProspect())->toBeTrue();
    });

    it('isProspect returns false for contrato_assinado status', function () {
        $client = new ClientProfile(['status' => 'contrato_assinado']);
        expect($client->isProspect())->toBeFalse();
    });

    it('display_name uses nome for pessoa fisica', function () {
        $client = new ClientProfile([
            'tipo_pessoa'   => 'pf',
            'nome'          => 'João da Silva',
            'razao_social'  => null,
            'nome_fantasia' => null,
        ]);
        expect($client->display_name)->toBe('João da Silva');
    });

    it('display_name uses razao_social for pessoa juridica', function () {
        $client = new ClientProfile([
            'tipo_pessoa'   => 'pj',
            'nome'          => null,
            'razao_social'  => 'Empresa Teste LTDA',
            'nome_fantasia' => 'Empresa Fantasia',
        ]);
        expect($client->display_name)->toBe('Empresa Teste LTDA');
    });

    it('display_name falls back to nome_fantasia when razao_social is empty for pj', function () {
        $client = new ClientProfile([
            'tipo_pessoa'   => 'pj',
            'nome'          => null,
            'razao_social'  => null,
            'nome_fantasia' => 'Fantasia SA',
        ]);
        expect($client->display_name)->toBe('Fantasia SA');
    });

    it('display_name returns dash when all name fields are empty', function () {
        $client = new ClientProfile([
            'tipo_pessoa'   => 'pf',
            'nome'          => null,
            'razao_social'  => null,
            'nome_fantasia' => null,
        ]);
        expect($client->display_name)->toBe('-');
    });
});
