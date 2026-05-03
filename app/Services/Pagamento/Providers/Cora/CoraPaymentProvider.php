<?php

namespace App\Services\Pagamento\Providers\Cora;

use App\Contracts\Payments\PaymentProviderContract;
use App\DTOs\Payments\CreatePaymentDTO;
use App\DTOs\Payments\PaymentProviderResponseDTO;
use App\Models\Pagamento\PaymentProviderAccount;
use RuntimeException;

class CoraPaymentProvider implements PaymentProviderContract
{
    private PaymentProviderAccount $account;

    public function __construct(
        private readonly CoraAuthService $authService,
        private readonly CoraHttpClient $httpClient,
    ) {
    }

    public function providerName(): string
    {
        return 'cora';
    }

    public function setAccount(PaymentProviderAccount $account): self
    {
        $this->account = $account;

        return $this;
    }

    public function createPayment(CreatePaymentDTO $dto): PaymentProviderResponseDTO
    {
        $token = $this->authService->accessToken($this->account);
        $payload = $this->buildPayload($dto);

        $response = $this->httpClient
            ->client($this->account, $token)
            ->post('/invoices', $payload);

        if (!$response->successful()) {
            throw new RuntimeException('Falha ao gerar pagamento na Cora: ' . $response->body());
        }

        return $this->mapResponse($response->json());
    }

    public function getPayment(string $providerPaymentId): PaymentProviderResponseDTO
    {
        $token = $this->authService->accessToken($this->account);

        $response = $this->httpClient
            ->client($this->account, $token)
            ->get('/invoices/' . $providerPaymentId);

        if (!$response->successful()) {
            throw new RuntimeException('Falha ao consultar pagamento na Cora: ' . $response->body());
        }

        return $this->mapResponse($response->json());
    }

    public function cancelPayment(string $providerPaymentId): bool
    {
        $token = $this->authService->accessToken($this->account);

        $response = $this->httpClient
            ->client($this->account, $token)
            ->delete('/invoices/' . $providerPaymentId);

        return $response->successful();
    }

    private function buildPayload(CreatePaymentDTO $dto): array
    {
        $document = preg_replace('/\D+/', '', $dto->customer->document ?? '');

        return [
            'code' => $dto->externalId,
            'amount' => (int) round($dto->amount * 100),
            'due_date' => $dto->dueDate,
            'description' => $dto->description,
            'customer' => [
                'name' => $dto->customer->name,
                'email' => $dto->customer->email,
                'document' => [
                    'identity' => $document,
                    'type' => strlen($document) > 11 ? 'CNPJ' : 'CPF',
                ],
            ],
            'payment_options' => [
                'bank_slip' => true,
                'pix' => true,
            ],
            'metadata' => $dto->metadata,
        ];
    }

    private function mapResponse(array $data): PaymentProviderResponseDTO
    {
        $providerStatus = $data['status'] ?? null;

        return new PaymentProviderResponseDTO(
            provider: 'cora',
            providerPaymentId: $data['id'] ?? null,
            providerStatus: $providerStatus,
            status: $this->normalizeStatus($providerStatus),
            barcode: $data['payment_options']['bank_slip']['barcode'] ?? null,
            digitableLine: $data['payment_options']['bank_slip']['digitable_line'] ?? null,
            pixQrCode: $data['payment_options']['pix']['qr_code'] ?? null,
            pixCopyPaste: $data['payment_options']['pix']['copy_paste'] ?? null,
            checkoutUrl: $data['checkout_url'] ?? null,
            pdfUrl: $data['payment_options']['bank_slip']['url'] ?? null,
            paidAmount: isset($data['paid_amount']) ? ((float) $data['paid_amount'] / 100) : null,
            paidAt: $data['paid_at'] ?? null,
            rawPayload: $data,
        );
    }

    private function normalizeStatus(?string $providerStatus): string
    {
        return match (strtolower((string) $providerStatus)) {
            'paid', 'payed', 'settled' => 'paid',
            'cancelled', 'canceled' => 'cancelled',
            'expired' => 'expired',
            'failed', 'error' => 'failed',
            default => 'generated',
        };
    }
}
