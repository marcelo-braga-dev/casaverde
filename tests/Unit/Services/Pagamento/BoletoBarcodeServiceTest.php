<?php

use App\Services\Pagamento\BoletoBarcodeService;

describe('BoletoBarcodeService', function () {

    beforeEach(function () {
        $this->service = new BoletoBarcodeService;
    });

    it('generates a base64 png image for a valid 44-digit barcode', function () {
        $image = $this->service->barcodeImageBase64(str_repeat('1', 44));

        expect($image)->toStartWith('data:image/png;base64,');
    });

    it('strips non-digit characters before validating the barcode length', function () {
        $formatted = str_repeat('1', 44);
        $withMask = substr($formatted, 0, 5).'.'.substr($formatted, 5);

        $image = $this->service->barcodeImageBase64($withMask);

        expect($image)->toStartWith('data:image/png;base64,');
    });

    it('throws when the barcode does not have 44 digits', function () {
        expect(fn () => $this->service->barcodeImageBase64('12345'))
            ->toThrow(InvalidArgumentException::class);
    });

    it('formats a 47-digit digitable line into febraban blocks', function () {
        $formatted = $this->service->formatDigitableLine('12345678901234567890123456789012345678901234567');

        expect($formatted)->toBe('12345.67890  12345.678901  23456.789012  3  45678901234567');
    });

    it('returns the original value when the digitable line does not have 47 digits', function () {
        $formatted = $this->service->formatDigitableLine('12345');

        expect($formatted)->toBe('12345');
    });
});
