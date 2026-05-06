<?php

namespace App\DTOs\Payments;

class CreatePaymentDTO
{
    public function __construct(
        public readonly string $externalId,
        public readonly float $amount,
        public readonly ?string $dueDate,
        public readonly string $description,
        public readonly string $paymentMethod,
        public readonly PaymentCustomerDTO $customer,
        public readonly array $metadata = [],
    ) {
    }
}
