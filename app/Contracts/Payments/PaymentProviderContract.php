<?php

namespace App\Contracts\Payments;

use App\DTOs\Payments\CreatePaymentDTO;
use App\DTOs\Payments\PaymentProviderResponseDTO;
use App\Models\Pagamento\PaymentProviderAccount;

interface PaymentProviderContract
{
    public function providerName(): string;

    public function setAccount(PaymentProviderAccount $account): self;

    public function createPayment(CreatePaymentDTO $dto): PaymentProviderResponseDTO;

    public function getPayment(string $providerPaymentId): PaymentProviderResponseDTO;

    public function cancelPayment(string $providerPaymentId): bool;
}
