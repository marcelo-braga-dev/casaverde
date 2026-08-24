<?php

namespace App\Services\Pagamento;

use App\DTOs\Payments\CreatePaymentDTO;
use App\DTOs\Payments\PaymentCustomerDTO;
use App\Exceptions\Payments\PaymentProviderException;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Endereco\Address;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\UserAddress;
use InvalidArgumentException;

class GeneratePaymentSlipService
{
    public function __construct(
        private readonly PaymentProviderManager $providerManager,
    ) {}

    public function handle(CustomerCharge $charge, string $provider = 'cora', string $paymentMethod = 'boleto_pix'): PaymentSlip
    {
        if (! in_array($charge->status, ['open', 'waiting_payment'], true)) {
            throw new InvalidArgumentException('A cobrança precisa estar aberta para gerar pagamento.');
        }

        $existingSlip = PaymentSlip::query()
            ->where('customer_charge_id', $charge->id)
            ->whereIn('status', ['pending', 'generated'])
            ->first();

        if ($existingSlip) {
            throw new InvalidArgumentException('Já existe um pagamento ativo para esta cobrança.');
        }

        $charge->loadMissing([
            'clientProfile.contacts',
            'clientProfile.proposals.address',
            'platformUser',
            'bill.consumerUnit.address',
        ]);

        $account = $this->providerManager->defaultAccount($provider);
        $providerInstance = $this->providerManager->make($provider, $account);

        $address = $this->resolveAddress($charge);

        // A Orders API do Mercado Pago exige payer.address para boleto (ticket); sem
        // isso o provider rejeita com "missing properties: address" e a tentativa fica
        // registrada como falha sem dar nenhuma pista acionável para o admin. Bloqueamos
        // antes de gastar uma chamada ao provider.
        if ($provider === 'mercado_pago' && $paymentMethod === 'boleto' && ! $address) {
            throw new InvalidArgumentException('Não é possível gerar boleto via Mercado Pago: o cliente não possui endereço cadastrado (nem no portal, nem na unidade consumidora, nem na proposta comercial).');
        }

        $customer = new PaymentCustomerDTO(
            name: $charge->clientProfile?->display_name
            ?? $charge->clientProfile?->nome
            ?? $charge->clientProfile?->razao_social
            ?? 'Cliente',
            email: $this->resolveEmail($charge),
            document: $charge->clientProfile?->cpf ?? $charge->clientProfile?->cnpj ?? null,
            phone: $charge->clientProfile?->contacts?->celular ?? $charge->clientProfile?->contacts?->telefone ?? null,
            address: $address,
        );

        $dto = new CreatePaymentDTO(
            externalId: 'charge-'.$charge->id,
            amount: (float) $charge->final_amount,
            dueDate: $charge->due_date?->format('Y-m-d'),
            description: 'Cobrança Casa Verde '.($charge->reference_label ?? '#'.$charge->id),
            paymentMethod: $paymentMethod,
            customer: $customer,
            metadata: [
                'customer_charge_id' => $charge->id,
                'client_profile_id' => $charge->client_profile_id,
                'reference_label' => $charge->reference_label,
            ],
        );

        $requestPayload = [
            'external_id' => $dto->externalId,
            'amount' => $dto->amount,
            'due_date' => $dto->dueDate,
            'payment_method' => $dto->paymentMethod,
            'customer' => [
                'name' => $dto->customer->name,
                'email' => $dto->customer->email,
                'document' => $dto->customer->document,
                'phone' => $dto->customer->phone,
                'address' => $dto->customer->address,
            ],
            'metadata' => $dto->metadata,
        ];

        try {
            $response = $providerInstance->createPayment($dto);
        } catch (PaymentProviderException $e) {
            // Persiste a tentativa falha para dar visibilidade histórica (tela de
            // Pagamentos) mesmo quando o provider rejeita a cobrança; a mensagem
            // real do provider fica só no registro, nunca é repassada ao usuário.
            PaymentSlip::create([
                'customer_charge_id' => $charge->id,
                'payment_provider_account_id' => $account->id,
                'provider' => $provider,
                'provider_status' => 'failed',
                'payment_method' => $paymentMethod,
                'status' => 'failed',
                'amount' => $charge->final_amount,
                'due_date' => $charge->due_date,
                'request_payload' => $requestPayload,
                'response_payload' => $e->responsePayload,
                'error_message' => $e->getMessage(),
                'generated_at' => now(),
            ]);

            throw $e;
        }

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
            'request_payload' => $requestPayload,
            'response_payload' => $response->rawPayload,
            'generated_at' => now(),
        ]);
    }

    /**
     * O e-mail de contato do cliente (cadastro) é sempre preferido em relação ao
     * e-mail de login da plataforma, porque clientes que nunca ativaram o portal
     * recebem um e-mail sintético "cliente-{id}@casaverde.local" (IssueClientContractService)
     * só para satisfazer o unique da tabela users — nunca é um endereço real, e
     * provedores de pagamento (ex: Mercado Pago) rejeitam com invalid_payer_email.
     */
    private function resolveEmail(CustomerCharge $charge): ?string
    {
        $contactEmail = $charge->clientProfile?->contacts?->email;

        if ($contactEmail) {
            return $contactEmail;
        }

        $platformEmail = $charge->platformUser?->email;

        if ($platformEmail && ! str_ends_with($platformEmail, '@casaverde.local')) {
            return $platformEmail;
        }

        return null;
    }

    private function resolveAddress(CustomerCharge $charge): ?array
    {
        $userId = $charge->clientProfile?->platform_user_id;

        if ($userId) {
            $address = UserAddress::query()->where('user_id', $userId)->first();

            if ($address && $address->cep) {
                return $this->mapAddress($address);
            }
        }

        $unitAddress = $charge->bill?->consumerUnit?->address;

        if ($unitAddress && $unitAddress->cep) {
            return $this->mapAddress($unitAddress);
        }

        $proposalAddress = $charge->clientProfile?->proposals
            ->sortByDesc('id')
            ->pluck('address')
            ->first(fn (?Address $address) => $address && $address->cep);

        if ($proposalAddress) {
            return $this->mapAddress($proposalAddress);
        }

        return null;
    }

    private function mapAddress(UserAddress|Address $address): array
    {
        return [
            'zip_code' => $address->cep,
            'street_name' => $address->rua,
            'street_number' => $address->numero ?: 'S/N',
            'neighborhood' => $address->bairro,
            'city' => $address->cidade,
            'state' => $address->estado,
        ];
    }
}
