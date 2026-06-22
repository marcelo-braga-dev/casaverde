<?php

use App\DTOs\Payments\CreatePaymentDTO;
use App\DTOs\Payments\PaymentCustomerDTO;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Pagamento\Providers\Cora\CoraPaymentProvider;
use Illuminate\Support\Facades\Http;

function makeCoraPaymentDto(string $document = '12345678901'): CreatePaymentDTO
{
    return new CreatePaymentDTO(
        externalId: 'charge-1',
        amount: 250.00,
        dueDate: '2026-07-01',
        description: 'Cobrança teste',
        paymentMethod: 'boleto_pix',
        customer: new PaymentCustomerDTO(
            name: 'Cliente Teste',
            email: 'cliente@example.com',
            document: $document,
        ),
    );
}

describe('CoraPaymentProvider', function () {

    beforeEach(function () {
        $this->provider = app(CoraPaymentProvider::class);
        $this->account = PaymentProviderAccount::factory()->create([
            'base_url' => 'https://cora.test',
        ]);
        $this->provider->setAccount($this->account);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
        ]);
    });

    it('creates a payment and maps the provider response', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response([
                'id' => 'inv-1',
                'status' => 'OPEN',
                'payment_options' => [
                    'bank_slip' => ['barcode' => '123456', 'digitable_line' => '1234.5678', 'url' => 'https://cora.test/boleto.pdf'],
                    'pix' => ['qr_code' => 'qr-code', 'copy_paste' => 'copy-paste'],
                ],
                'checkout_url' => 'https://cora.test/checkout',
            ], 201),
        ]);

        $response = $this->provider->createPayment(makeCoraPaymentDto());

        expect($response->provider)->toBe('cora')
            ->and($response->providerPaymentId)->toBe('inv-1')
            ->and($response->status)->toBe('generated')
            ->and($response->barcode)->toBe('123456')
            ->and($response->digitableLine)->toBe('1234.5678')
            ->and($response->pixQrCode)->toBe('qr-code')
            ->and($response->pixCopyPaste)->toBe('copy-paste')
            ->and($response->checkoutUrl)->toBe('https://cora.test/checkout')
            ->and($response->pdfUrl)->toBe('https://cora.test/boleto.pdf');
    });

    it('sends CPF document type when document has 11 digits', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['id' => 'inv-1', 'status' => 'OPEN'], 201),
        ]);

        $this->provider->createPayment(makeCoraPaymentDto('12345678901'));

        Http::assertSent(fn ($request) => str_contains($request->url(), '/invoices')
            && $request['customer']['document']['type'] === 'CPF');
    });

    it('sends CNPJ document type when document has more than 11 digits', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['id' => 'inv-1', 'status' => 'OPEN'], 201),
        ]);

        $this->provider->createPayment(makeCoraPaymentDto('12345678000199'));

        Http::assertSent(fn ($request) => str_contains($request->url(), '/invoices')
            && $request['customer']['document']['type'] === 'CNPJ');
    });

    it('throws RuntimeException when createPayment fails', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['error' => 'invalid'], 422),
        ]);

        expect(fn () => $this->provider->createPayment(makeCoraPaymentDto()))
            ->toThrow(RuntimeException::class, 'Falha ao gerar pagamento na Cora');
    });

    it('gets an existing payment', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-1' => Http::response(['id' => 'inv-1', 'status' => 'PAID', 'paid_amount' => 25000], 200),
        ]);

        $response = $this->provider->getPayment('inv-1');

        expect($response->status)->toBe('paid')
            ->and($response->paidAmount)->toBe(250.0);
    });

    it('throws RuntimeException when getPayment fails', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-1' => Http::response(['error' => 'not found'], 404),
        ]);

        expect(fn () => $this->provider->getPayment('inv-1'))
            ->toThrow(RuntimeException::class, 'Falha ao consultar pagamento na Cora');
    });

    it('cancels a payment', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-1' => Http::response([], 204),
        ]);

        expect($this->provider->cancelPayment('inv-1'))->toBeTrue();
    });

    it('normalizes unknown provider status to generated', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['id' => 'inv-1', 'status' => 'SOMETHING_NEW'], 201),
        ]);

        $response = $this->provider->createPayment(makeCoraPaymentDto());

        expect($response->status)->toBe('generated')
            ->and($response->providerStatus)->toBe('SOMETHING_NEW');
    });

});
