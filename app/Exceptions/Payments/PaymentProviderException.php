<?php

namespace App\Exceptions\Payments;

use RuntimeException;

class PaymentProviderException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly ?int $httpStatus = null,
        public readonly array $responsePayload = [],
    ) {
        parent::__construct($message);
    }
}
