<?php

use App\Support\LogRedactor;

it('masks payer personal data recursively and keeps operational fields', function () {
    $redacted = LogRedactor::redact([
        'total_amount' => '100.00',
        'payer' => [
            'email' => 'cliente@example.com',
            'first_name' => 'Maria',
            'identification' => ['type' => 'CPF', 'number' => '12345678901'],
            'address' => ['zip_code' => '80000000', 'street_name' => 'Rua A'],
        ],
        'transactions' => ['payments' => [['amount' => '100.00', 'expiration_time' => 'P3D']]],
    ]);

    expect($redacted['total_amount'])->toBe('100.00')
        ->and($redacted['payer']['email'])->toBe('***')
        ->and($redacted['payer']['first_name'])->toBe('***')
        ->and($redacted['payer']['identification']['number'])->toBe('***')
        ->and($redacted['payer']['address']['zip_code'])->toBe('***')
        ->and($redacted['transactions']['payments'][0]['expiration_time'])->toBe('P3D');
});
