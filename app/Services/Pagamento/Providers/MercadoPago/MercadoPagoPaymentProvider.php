<?php

namespace App\Services\Pagamento\Providers\MercadoPago;

use App\Contracts\Payments\PaymentProviderContract;
use App\DTOs\Payments\CreatePaymentDTO;
use App\DTOs\Payments\PaymentProviderResponseDTO;
use App\Exceptions\Payments\PaymentProviderException;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Support\BoletoDueDate;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use InvalidArgumentException;

// Usa a Orders API (/v1/orders), não a Payments API clássica (/v1/payments): o Mercado
// Pago passou a exigir a Orders API para os "usuários de teste" gerados a partir de
// 2025+ — chamadas a /v1/payments com essa credencial retornam 401 "Unauthorized use
// of live credentials", mesmo sendo uma credencial de sandbox legítima.
class MercadoPagoPaymentProvider implements PaymentProviderContract
{
    private PaymentProviderAccount $account;

    public function __construct(
        private readonly MercadoPagoAuthService $authService,
        private readonly MercadoPagoHttpClient $httpClient,
    ) {}

    public function providerName(): string
    {
        return 'mercado_pago';
    }

    public function setAccount(PaymentProviderAccount $account): self
    {
        $this->account = $account;

        return $this;
    }

    public function createPayment(CreatePaymentDTO $dto): PaymentProviderResponseDTO
    {
        $paymentMethod = $this->resolvePaymentMethod($dto->paymentMethod);
        $token = $this->authService->accessToken($this->account);
        $payload = $this->buildPayload($dto, $paymentMethod);

        $response = $this->httpClient
            ->client($this->account, $token)
            // A chave não pode ser fixa por cobrança ($dto->externalId): o MP devolvia o pedido
            // falho em cache em novas tentativas e rejeitava com 409 ao trocar pix -> boleto.
            // GeneratePaymentSlipService manda uma chave por tentativa (cobrança + método +
            // nº de slips já registrados), estável só em retentativas após timeout.
            ->withHeaders(['X-Idempotency-Key' => $dto->idempotencyKey ?: (string) Str::uuid()])
            ->post('/v1/orders', $payload);

        if (! $response->successful()) {
            Log::error('Falha ao gerar pagamento no Mercado Pago', [
                'payment_provider_account_id' => $this->account->id,
                'external_id' => $dto->externalId,
                'http_status' => $response->status(),
                'request_payload' => $payload,
                'response_body' => $response->json() ?? $response->body(),
            ]);

            throw new PaymentProviderException(
                'Falha ao gerar pagamento no Mercado Pago: '.$response->body(),
                $response->status(),
                $response->json() ?? ['raw' => $response->body()],
            );
        }

        return $this->mapResponse($response->json());
    }

    public function getPayment(string $providerPaymentId): PaymentProviderResponseDTO
    {
        $token = $this->authService->accessToken($this->account);

        $response = $this->httpClient
            ->client($this->account, $token)
            ->get('/v1/orders/'.$providerPaymentId);

        if (! $response->successful()) {
            throw new PaymentProviderException(
                'Falha ao consultar pagamento no Mercado Pago: '.$response->body(),
                $response->status(),
                $response->json() ?? ['raw' => $response->body()],
            );
        }

        return $this->mapResponse($response->json());
    }

    public function cancelPayment(string $providerPaymentId): bool
    {
        $token = $this->authService->accessToken($this->account);

        $response = $this->httpClient
            ->client($this->account, $token)
            ->withHeaders(['X-Idempotency-Key' => (string) Str::uuid()])
            ->post('/v1/orders/'.$providerPaymentId.'/cancel');

        return $response->successful();
    }

    private function resolvePaymentMethod(string $paymentMethod): array
    {
        return match ($paymentMethod) {
            'pix' => ['id' => 'pix', 'type' => 'bank_transfer'],
            'boleto' => ['id' => 'bolbradesco', 'type' => 'ticket'],
            default => throw new InvalidArgumentException(
                "Mercado Pago exige a escolha de um único método de pagamento ('pix' ou 'boleto'), recebido: '{$paymentMethod}'."
            ),
        };
    }

    private function buildPayload(CreatePaymentDTO $dto, array $paymentMethod): array
    {
        $document = preg_replace('/\D+/', '', $dto->customer->document ?? '');
        [$firstName, $lastName] = $this->splitName($dto->customer->name);
        $amount = number_format($dto->amount, 2, '.', '');

        $payer = array_filter([
            // "casaverde.coop.br" não existe (domínio real é casaverdeconsorcio.com.br) —
            // um domínio inexistente aqui é rejeitado pelo Mercado Pago com invalid_payer_email.
            'email' => $dto->customer->email ?: 'sem-email@casaverdeconsorcio.com.br',
            'first_name' => $firstName,
            'last_name' => $lastName,
            'identification' => $document ? [
                'type' => strlen($document) > 11 ? 'CNPJ' : 'CPF',
                'number' => $document,
            ] : null,
            // Obrigatório para Boleto (bolbradesco); o Pix funciona sem endereço.
            'address' => $dto->customer->address,
        ], fn ($value) => $value !== null);

        return [
            'type' => 'online',
            'total_amount' => $amount,
            'external_reference' => $dto->externalId,
            'payer' => $payer,
            'transactions' => [
                'payments' => [
                    array_filter([
                        'amount' => $amount,
                        'payment_method' => $paymentMethod,
                        'expiration_time' => $this->expirationTime($dto->dueDate),
                    ]),
                ],
            ],
        ];
    }

    // Sem expiration_time o MP aplica o padrão (boleto: 3 dias úteis; Pix: 24h) e ignora o
    // vencimento da cobrança. A Orders API aceita de 1 a 30 dias (duração ISO 8601).
    private function expirationTime(?string $dueDate): ?string
    {
        if (! $dueDate) {
            return null;
        }

        $days = (int) CarbonImmutable::today()->diffInDays(CarbonImmutable::parse($dueDate)->startOfDay(), false);

        // Cobrança já vencida (reemissão de boleto vencido): 3 dias, o prazo que o MP
        // recomenda para não colidir com a compensação; senão o boleto venceria amanhã.
        if ($days < 1) {
            return 'P3D';
        }

        return 'P'.min(30, $days).'D';
    }

    private function splitName(string $name): array
    {
        $parts = preg_split('/\s+/', trim($name), 2);
        $firstName = $parts[0] ?: 'Cliente';
        $lastName = $parts[1] ?? $firstName;

        return [$firstName, $lastName];
    }

    private function mapResponse(array $data): PaymentProviderResponseDTO
    {
        $status = $data['status'] ?? null;
        $statusDetail = $data['status_detail'] ?? null;
        $payment = $data['transactions']['payments'][0] ?? [];
        $paymentMethodData = $payment['payment_method'] ?? [];
        $normalizedStatus = $this->normalizeStatus($status, $statusDetail);

        return new PaymentProviderResponseDTO(
            provider: 'mercado_pago',
            providerPaymentId: isset($data['id']) ? (string) $data['id'] : null,
            providerStatus: $statusDetail ?: $status,
            status: $normalizedStatus,
            barcode: $paymentMethodData['barcode_content'] ?? null,
            digitableLine: $paymentMethodData['digitable_line'] ?? null,
            pixQrCode: $paymentMethodData['qr_code'] ?? null,
            pixCopyPaste: $paymentMethodData['qr_code'] ?? null,
            checkoutUrl: $paymentMethodData['ticket_url'] ?? null,
            pdfUrl: $paymentMethodData['ticket_url'] ?? null,
            paidAmount: $normalizedStatus === 'paid' && isset($data['total_paid_amount']) ? (float) $data['total_paid_amount'] : null,
            paidAt: $normalizedStatus === 'paid' ? ($data['last_updated_date'] ?? null) : null,
            rawPayload: $data,
            // O MP joga o vencimento para o próximo dia útil e não o devolve na resposta;
            // o código de barras é a fonte da data que o banco realmente vai aceitar.
            dueDate: BoletoDueDate::fromBarcode($paymentMethodData['barcode_content'] ?? null)?->toDateString(),
        );
    }

    private function normalizeStatus(?string $status, ?string $statusDetail): string
    {
        return match ($status) {
            'processed' => str_contains((string) $statusDetail, 'rejected') ? 'failed' : 'paid',
            'canceled' => 'cancelled',
            'refunded' => 'refunded',
            'expired' => 'expired',
            'failed' => 'failed',
            // 'action_required' (Pix aguardando pagamento), 'processing'/'pending' (Boleto
            // aguardando compensação) — todos ainda em aberto do lado do provider.
            default => 'generated',
        };
    }
}
