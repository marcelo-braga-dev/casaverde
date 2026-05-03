<?php

namespace App\Services\Pagamento;

use App\DTOs\Payments\CreatePaymentDTO;
use App\DTOs\Payments\PaymentCustomerDTO;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class GeneratePaymentSlipService
{
    public function __construct(
        private readonly PaymentProviderManager $providerManager,
    ) {
    }

    public function handle(CustomerCharge $charge, string $provider = 'cora', string $paymentMethod = 'boleto_pix'): PaymentSlip
    {
        if (!in_array($charge->status, ['open', 'waiting_payment'], true)) {
            throw new InvalidArgumentException('A cobrança precisa estar aberta para gerar pagamento.');
        }

        $existingSlip = PaymentSlip::query()
            ->where('customer_charge_id', $charge->id)
            ->whereIn('status', ['pending', 'generated'])
            ->first();

        if ($existingSlip) {
            throw new InvalidArgumentException('Já existe um pagamento ativo para esta cobrança.');
        }

        return DB::transaction(function () use ($charge, $provider, $paymentMethod) {
            $charge->loadMissing([
                'clientProfile',
                'platformUser',
            ]);

            $account = $this->providerManager->defaultAccount($provider);
            $providerInstance = $this->providerManager->make($provider, $account);

            $customer = new PaymentCustomerDTO(
                name: $charge->clientProfile?->display_name
                ?? $charge->clientProfile?->nome
                ?? $charge->clientProfile?->razao_social
                ?? 'Cliente',
                email: $charge->platformUser?->email ?? $charge->clientProfile?->email ?? null,
                document: $charge->clientProfile?->cpf ?? $charge->clientProfile?->cnpj ?? null,
                phone: $charge->clientProfile?->phone ?? null,
            );

            $dto = new CreatePaymentDTO(
                externalId: 'charge-' . $charge->id,
                amount: (float) $charge->final_amount,
                dueDate: $charge->due_date?->format('Y-m-d'),
                description: 'Cobrança Casa Verde ' . ($charge->reference_label ?? '#' . $charge->id),
                paymentMethod: $paymentMethod,
                customer: $customer,
                metadata: [
                    'customer_charge_id' => $charge->id,
                    'client_profile_id' => $charge->client_profile_id,
                    'reference_label' => $charge->reference_label,
                ],
            );

            $response = $providerInstance->createPayment($dto);

            return PaymentSlip::create([
                'customer_charge_id' => $charge->id,
                'payment_provider_account_id' => $account->id,
                'provider' => $response->provider,
                'provider_payment_id' => $response->providerPaymentId,
                'provider_status' => $response->providerStatus,
                'payment_method' => $paymentMethod,
                'status' => $response->status,
                'amount' => $charge->final_amount,
                'due_date' => $charge->due_date,
                'barcode' => $response->barcode,
                'digitable_line' => $response->digitableLine,
                'pix_qr_code' => $response->pixQrCode,
                'pix_copy_paste' => $response->pixCopyPaste,
                'checkout_url' => $response->checkoutUrl,
                'pdf_url' => $response->pdfUrl,
                'request_payload' => [
                    'external_id' => $dto->externalId,
                    'amount' => $dto->amount,
                    'due_date' => $dto->dueDate,
                    'payment_method' => $dto->paymentMethod,
                    'customer' => [
                        'name' => $dto->customer->name,
                        'email' => $dto->customer->email,
                        'document' => $dto->customer->document,
                        'phone' => $dto->customer->phone,
                    ],
                    'metadata' => $dto->metadata,
                ],
                'response_payload' => $response->rawPayload,
                'generated_at' => now(),
            ]);
        });
    }
}
