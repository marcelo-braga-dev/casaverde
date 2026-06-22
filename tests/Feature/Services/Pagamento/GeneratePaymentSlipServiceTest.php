<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\GeneratePaymentSlipService;
use Illuminate\Support\Facades\Http;

describe('GeneratePaymentSlipService', function () {

    beforeEach(function () {
        $this->service = app(GeneratePaymentSlipService::class);

        PaymentProviderAccount::factory()->create([
            'provider' => 'cora',
            'base_url' => 'https://cora.test',
            'is_active' => true,
            'is_default' => true,
        ]);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
        ]);
    });

    it('creates a payment slip for an open charge using the client phone and email from contacts', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response([
                'id' => 'inv-1',
                'status' => 'OPEN',
                'payment_options' => [
                    'bank_slip' => ['barcode' => '123456', 'digitable_line' => '1234.5678'],
                    'pix' => ['qr_code' => 'qr', 'copy_paste' => 'copy'],
                ],
            ], 201),
        ]);

        $client = ClientProfile::factory()->create();
        $client->contacts->update(['celular' => '41999990000', 'email' => 'contato@example.com']);

        $charge = CustomerCharge::factory()->create([
            'client_profile_id' => $client->id,
            'status' => 'open',
            'final_amount' => 300.00,
        ]);

        $slip = $this->service->handle($charge);

        expect($slip)->toBeInstanceOf(PaymentSlip::class)
            ->and($slip->status)->toBe('generated')
            ->and($slip->provider)->toBe('cora')
            ->and($slip->provider_payment_id)->toBe('inv-1')
            ->and((float) $slip->amount)->toBe(300.0)
            ->and($slip->request_payload['customer']['phone'])->toBe('(41) 9 9999-0000')
            ->and($slip->request_payload['customer']['email'])->toBe('contato@example.com');
    });

    it('throws when the charge is not open or waiting payment', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'paid']);

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'A cobrança precisa estar aberta para gerar pagamento.');
    });

    it('throws when an active slip already exists for the charge', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'status' => 'generated']);

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Já existe um pagamento ativo para esta cobrança.');
    });

    it('does not leave a partial slip when the provider call fails', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['error' => 'invalid'], 422),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        expect(fn () => $this->service->handle($charge))->toThrow(RuntimeException::class);

        expect(PaymentSlip::where('customer_charge_id', $charge->id)->count())->toBe(0);
    });

});
