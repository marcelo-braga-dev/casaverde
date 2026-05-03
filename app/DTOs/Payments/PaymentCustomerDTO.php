<?php

namespace App\DTOs\Payments;

class PaymentCustomerDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $email,
        public readonly ?string $document,
        public readonly ?string $phone = null,
    ) {
    }
}
