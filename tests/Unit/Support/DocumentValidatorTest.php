<?php

use App\Support\DocumentValidator;

it('accepts valid CPF and CNPJ, formatted or not', function (string $document) {
    expect(DocumentValidator::isValid($document))->toBeTrue();
})->with(['529.982.247-25', '52998224725', '11.222.333/0001-81', '11222333000181']);

it('rejects documents with wrong check digits, repeated digits or wrong length', function (?string $document) {
    expect(DocumentValidator::isValid($document))->toBeFalse();
})->with(['52998224724', '11111111111', '11222333000180', '00000000000000', '123', '', null]);
