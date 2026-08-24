<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentTransaction;
use App\Services\Pagamento\GeneratePaymentSlipService;
use App\Services\Pagamento\SyncPaymentSlipService;
use Illuminate\Support\Facades\Http;

function makeSyncSlip(string $providerPaymentId, string $status, string $chargeStatus = 'open'): array
{
    $charge = CustomerCharge::factory()->create(['status' => $chargeStatus]);
    $slip = PaymentSlip::factory()->create([
        'customer_charge_id' => $charge->id,
        'payment_provider_account_id' => PaymentProviderAccount::where('provider', 'cora')->first()->id,
        'provider' => 'cora',
        'provider_payment_id' => $providerPaymentId,
        'status' => $status,
    ]);

    return [$charge, $slip];
}

describe('SyncPaymentSlipService', function () {

    beforeEach(function () {
        $this->service = app(SyncPaymentSlipService::class);

        $this->account = PaymentProviderAccount::factory()->create([
            'provider' => 'cora',
            'base_url' => 'https://cora.test',
            'is_active' => true,
            'is_default' => true,
        ]);

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
        ]);
    });

    it('marks the slip and charge as paid on first sync', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-1' => Http::response(['id' => 'inv-1', 'status' => 'PAID', 'paid_amount' => 25000], 200),
        ]);

        [$charge, $slip] = makeSyncSlip('inv-1', 'generated');

        $this->service->handle($slip);

        expect($slip->refresh()->status)->toBe('paid')
            ->and($charge->refresh()->status)->toBe('paid')
            ->and(PaymentTransaction::where('payment_slip_id', $slip->id)->count())->toBe(1);
    });

    it('is idempotent when synced twice after being paid (no duplicate transaction)', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-2' => Http::response(['id' => 'inv-2', 'status' => 'PAID', 'paid_amount' => 25000], 200),
        ]);

        [$charge, $slip] = makeSyncSlip('inv-2', 'generated');

        $this->service->handle($slip);
        $this->service->handle($slip->fresh());

        expect(PaymentTransaction::where('payment_slip_id', $slip->id)->count())->toBe(1);
    });

    it('updates the slip to cancelled when the provider reports cancellation, and reopens an open charge', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-3' => Http::response(['id' => 'inv-3', 'status' => 'CANCELLED'], 200),
        ]);

        [$charge, $slip] = makeSyncSlip('inv-3', 'generated', 'open');

        $this->service->handle($slip);

        expect($slip->refresh()->status)->toBe('cancelled')
            ->and($charge->refresh()->status)->toBe('open');
    });

    it('reopens an overdue charge when its slip is synced as cancelled, unblocking reissue', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-4' => Http::response(['id' => 'inv-4', 'status' => 'CANCELLED'], 200),
        ]);

        [$charge, $slip] = makeSyncSlip('inv-4', 'generated', 'overdue');

        $this->service->handle($slip);

        // Sem isso a charge ficaria travada em "overdue" para sempre: nem
        // GeneratePaymentSlipService nem a automação geram pagamento fora de
        // open/waiting_payment.
        expect($charge->refresh()->status)->toBe('open');

        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['id' => 'inv-4-b', 'status' => 'OPEN'], 201),
        ]);

        $newSlip = app(GeneratePaymentSlipService::class)->handle($charge->refresh());
        expect($newSlip)->toBeInstanceOf(PaymentSlip::class);
    });

    it('reopens an overdue charge when its slip is synced as expired, unblocking reissue', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-5' => Http::response(['id' => 'inv-5', 'status' => 'EXPIRED'], 200),
        ]);

        [$charge, $slip] = makeSyncSlip('inv-5', 'generated', 'overdue');

        $this->service->handle($slip);

        expect($charge->refresh()->status)->toBe('open');
    });

    it('does not reopen the charge when it is already paid', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-6' => Http::response(['id' => 'inv-6', 'status' => 'CANCELLED'], 200),
        ]);

        [$charge, $slip] = makeSyncSlip('inv-6', 'generated', 'paid');

        $this->service->handle($slip);

        expect($charge->refresh()->status)->toBe('paid');
    });

    it('throws when the slip has no provider payment id', function () {
        $slip = PaymentSlip::factory()->create(['provider_payment_id' => null]);

        expect(fn () => $this->service->handle($slip))
            ->toThrow(InvalidArgumentException::class, 'Pagamento sem ID no provider.');
    });

});
