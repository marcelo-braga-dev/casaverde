<?php

namespace App\DTOs\Payments;

class PaymentCustomerDTO
{
    /**
     * @param  array{zip_code: ?string, street_name: ?string, street_number: ?string, neighborhood: ?string, city: ?string, state: ?string}|null  $address
     */
    public function __construct(
        public readonly string $name,
        public readonly ?string $email,
        public readonly ?string $document,
        public readonly ?string $phone = null,
        public readonly ?array $address = null,
    ) {}
}
