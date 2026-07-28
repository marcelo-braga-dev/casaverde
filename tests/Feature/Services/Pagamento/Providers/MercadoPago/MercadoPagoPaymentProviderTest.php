<?php

use App\DTOs\Payments\CreatePaymentDTO;
use App\DTOs\Payments\PaymentCustomerDTO;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Pagamento\Providers\MercadoPago\MercadoPagoPaymentProvider;
use Illuminate\Support\Facades\Http;

function makeMercadoPagoDto(string $paymentMethod = 'pix', string $document = '12345678901'): CreatePaymentDTO
{
    return new CreatePaymentDTO(
        externalId: 'charge-1',
        amount: 250.00,
        dueDate: '2026-07-01',
        description: 'Cobrança teste',
        paymentMethod: $paymentMethod,
        customer: new PaymentCustomerDTO(
            name: 'Cliente Teste',
            email: 'cliente@example.com',
            document: $document,
        ),
    );
}

describe('MercadoPagoPaymentProvider', function () {

    beforeEach(function () {
        $this->provider = app(MercadoPagoPaymentProvider::class);
        $this->account = PaymentProviderAccount::factory()->mercadoPago()->create([
            'base_url' => 'https://mp.test',
        ]);
        $this->provider->setAccount($this->account);
    });

    it('creates a pix order and maps the provider response', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response([
                'id' => 'ORD111',
                'status' => 'action_required',
                'status_detail' => 'waiting_transfer',
                'total_paid_amount' => '0.00',
                'transactions' => [
                    'payments' => [
                        [
                            'id' => 'PAY111',
                            'status' => 'action_required',
                            'status_detail' => 'waiting_transfer',
                            'payment_method' => [
                                'id' => 'pix',
                                'type' => 'bank_transfer',
                                'qr_code' => 'copia-e-cola',
                                'ticket_url' => 'https://mp.test/ticket',
                            ],
                        ],
                    ],
                ],
            ], 201),
        ]);

        $response = $this->provider->createPayment(makeMercadoPagoDto('pix'));

        expect($response->provider)->toBe('mercado_pago')
            ->and($response->providerPaymentId)->toBe('ORD111')
            ->and($response->status)->toBe('generated')
            ->and($response->pixQrCode)->toBe('copia-e-cola')
            ->and($response->pixCopyPaste)->toBe('copia-e-cola')
            ->and($response->checkoutUrl)->toBe('https://mp.test/ticket');

        Http::assertSent(fn ($request) => str_contains($request->url(), '/v1/orders')
            && $request['transactions']['payments'][0]['payment_method']['id'] === 'pix'
            && $request->hasHeader('X-Idempotency-Key'));
    });

    it('creates a boleto order mapping payment_method to bolbradesco/ticket', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response([
                'id' => 'ORD222',
                'status' => 'processing',
                'status_detail' => 'in_process',
                'transactions' => [
                    'payments' => [
                        [
                            'id' => 'PAY222',
                            'status' => 'processing',
                            'status_detail' => 'in_process',
                            'payment_method' => [
                                'id' => 'bolbradesco',
                                'type' => 'ticket',
                                'barcode_content' => '34191.79001 01043.510047 91020.150008 1 96610000025000',
                                'digitable_line' => '34191790010104351004791020150008196610000025000',
                                'ticket_url' => 'https://mp.test/boleto.pdf',
                            ],
                        ],
                    ],
                ],
            ], 201),
        ]);

        $response = $this->provider->createPayment(makeMercadoPagoDto('boleto'));

        expect($response->status)->toBe('generated')
            ->and($response->barcode)->toContain('34191')
            ->and($response->digitableLine)->toContain('34191')
            ->and($response->pdfUrl)->toBe('https://mp.test/boleto.pdf');

        Http::assertSent(fn ($request) => $request['transactions']['payments'][0]['payment_method']['id'] === 'bolbradesco'
            && $request['transactions']['payments'][0]['payment_method']['type'] === 'ticket');
    });

    it('throws when payment method is ambiguous (boleto_pix is not supported by Mercado Pago)', function () {
        expect(fn () => $this->provider->createPayment(makeMercadoPagoDto('boleto_pix')))
            ->toThrow(InvalidArgumentException::class, 'Mercado Pago exige a escolha de um único método de pagamento');
    });

    it('sends CPF document type when document has 11 digits', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response(['id' => 'ORD1', 'status' => 'action_required'], 201),
        ]);

        $this->provider->createPayment(makeMercadoPagoDto('pix', '12345678901'));

        Http::assertSent(fn ($request) => $request['payer']['identification']['type'] === 'CPF');
    });

    it('sends CNPJ document type when document has more than 11 digits', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response(['id' => 'ORD1', 'status' => 'action_required'], 201),
        ]);

        $this->provider->createPayment(makeMercadoPagoDto('pix', '12345678000199'));

        Http::assertSent(fn ($request) => $request['payer']['identification']['type'] === 'CNPJ');
    });

    it('splits the customer name into first_name and last_name', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response(['id' => 'ORD1', 'status' => 'action_required'], 201),
        ]);

        $this->provider->createPayment(makeMercadoPagoDto('pix'));

        Http::assertSent(fn ($request) => $request['payer']['first_name'] === 'Cliente'
            && $request['payer']['last_name'] === 'Teste');
    });

    it('throws RuntimeException when createPayment fails', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response(['message' => 'invalid'], 400),
        ]);

        expect(fn () => $this->provider->createPayment(makeMercadoPagoDto('pix')))
            ->toThrow(RuntimeException::class, 'Falha ao gerar pagamento no Mercado Pago');
    });

    it('gets an existing order and marks it as paid when processed/accredited', function () {
        Http::fake([
            'mp.test/v1/orders/ORD111' => Http::response([
                'id' => 'ORD111',
                'status' => 'processed',
                'status_detail' => 'accredited',
                'total_paid_amount' => '250.00',
                'last_updated_date' => '2026-06-22T10:00:00.000-03:00',
                'transactions' => [
                    'payments' => [
                        ['id' => 'PAY111', 'status' => 'processed', 'status_detail' => 'accredited', 'payment_method' => ['id' => 'pix', 'type' => 'bank_transfer']],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->provider->getPayment('ORD111');

        expect($response->status)->toBe('paid')
            ->and($response->paidAmount)->toBe(250.0)
            ->and($response->paidAt)->toBe('2026-06-22T10:00:00.000-03:00');
    });

    it('does not report a paid amount while the order is still processing', function () {
        Http::fake([
            'mp.test/v1/orders/ORD111' => Http::response([
                'id' => 'ORD111',
                'status' => 'processing',
                'status_detail' => 'in_process',
                'total_paid_amount' => '0.00',
                'transactions' => ['payments' => [['id' => 'PAY111', 'payment_method' => ['id' => 'bolbradesco', 'type' => 'ticket']]]],
            ], 200),
        ]);

        $response = $this->provider->getPayment('ORD111');

        expect($response->status)->toBe('generated')
            ->and($response->paidAmount)->toBeNull();
    });

    it('throws RuntimeException when getPayment fails', function () {
        Http::fake([
            'mp.test/v1/orders/ORD111' => Http::response(['message' => 'not found'], 404),
        ]);

        expect(fn () => $this->provider->getPayment('ORD111'))
            ->toThrow(RuntimeException::class, 'Falha ao consultar pagamento no Mercado Pago');
    });

    it('cancels an order via POST /v1/orders/{id}/cancel', function () {
        Http::fake([
            'mp.test/v1/orders/ORD111/cancel' => Http::response(['id' => 'ORD111', 'status' => 'canceled'], 200),
        ]);

        expect($this->provider->cancelPayment('ORD111'))->toBeTrue();

        Http::assertSent(fn ($request) => $request->method() === 'POST'
            && str_contains($request->url(), '/v1/orders/ORD111/cancel'));
    });

    it('normalizes processed+rejected status_detail to failed', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response([
                'id' => 'ORD1',
                'status' => 'processed',
                'status_detail' => 'cc_rejected_other_reason',
            ], 201),
        ]);

        $response = $this->provider->createPayment(makeMercadoPagoDto('pix'));

        expect($response->status)->toBe('failed')
            ->and($response->providerStatus)->toBe('cc_rejected_other_reason');
    });

    it('normalizes canceled status to cancelled', function () {
        Http::fake([
            'mp.test/v1/orders/ORD111' => Http::response(['id' => 'ORD111', 'status' => 'canceled', 'status_detail' => 'canceled'], 200),
        ]);

        expect($this->provider->getPayment('ORD111')->status)->toBe('cancelled');
    });

    it('normalizes expired status to expired', function () {
        Http::fake([
            'mp.test/v1/orders/ORD111' => Http::response(['id' => 'ORD111', 'status' => 'expired', 'status_detail' => 'expired'], 200),
        ]);

        expect($this->provider->getPayment('ORD111')->status)->toBe('expired');
    });

    it('sends the customer address when present (required by Mercado Pago for boleto)', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response(['id' => 'ORD1', 'status' => 'processing'], 201),
        ]);

        $dto = new CreatePaymentDTO(
            externalId: 'charge-1',
            amount: 250.00,
            dueDate: '2026-07-01',
            description: 'Cobrança teste',
            paymentMethod: 'boleto',
            customer: new PaymentCustomerDTO(
                name: 'Cliente Teste',
                email: 'cliente@example.com',
                document: '12345678901',
                address: [
                    'zip_code' => '01310100',
                    'street_name' => 'Avenida Paulista',
                    'street_number' => '1000',
                    'neighborhood' => 'Bela Vista',
                    'city' => 'Sao Paulo',
                    'state' => 'SP',
                ],
            ),
        );

        $this->provider->createPayment($dto);

        Http::assertSent(fn ($request) => $request['payer']['address']['street_name'] === 'Avenida Paulista'
            && $request['payer']['address']['state'] === 'SP');
    });

});
