<?php

namespace App\DTOs\Payments;

class PaymentProviderResponseDTO
{
    public function __construct(
        public readonly string $provider,
        public readonly ?string $providerPaymentId,
        public readonly ?string $providerStatus,
        public readonly string $status,
        public readonly ?string $barcode = null,
        public readonly ?string $digitableLine = null,
        public readonly ?string $pixQrCode = null,
        public readonly ?string $pixCopyPaste = null,
        public readonly ?string $checkoutUrl = null,
        public readonly ?string $pdfUrl = null,
        public readonly ?float $paidAmount = null,
        public readonly ?string $paidAt = null,
        public readonly array $rawPayload = [],
    ) {
    }
}
