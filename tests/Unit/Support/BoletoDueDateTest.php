<?php

use App\Support\BoletoDueDate;

it('decodes the due date from the Febraban due date factor of the current cycle', function () {
    expect(BoletoDueDate::fromBarcode('34194159000000139431090220483492938649999000')->toDateString())->toBe('2026-10-05')
        ->and(BoletoDueDate::fromBarcode('34194100000000139431090220483492938649999000')->toDateString())->toBe('2025-02-22');
});

it('returns null for invalid barcodes or factors from the previous cycle', function (?string $barcode) {
    expect(BoletoDueDate::fromBarcode($barcode))->toBeNull();
})->with([null, '', '123', '34194099900000139431090220483492938649999000']);
