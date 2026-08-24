<?php

use App\Jobs\GeneratePaymentForChargeJob;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\GeneratePaymentSlipService;
use Illuminate\Support\Facades\Http;

describe('GeneratePaymentForChargeJob', function () {

    beforeEach(function () {
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

    it('generates a payment slip for an open charge without one', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['id' => 'inv-1', 'status' => 'OPEN'], 201),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        (new GeneratePaymentForChargeJob($charge->id))->handle(app(GeneratePaymentSlipService::class));

        expect(PaymentSlip::where('customer_charge_id', $charge->id)->count())->toBe(1);
    });

    it('silently skips (no exception, no new slip) when an active slip already exists', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'status' => 'generated']);

        (new GeneratePaymentForChargeJob($charge->id))->handle(app(GeneratePaymentSlipService::class));

        expect(PaymentSlip::where('customer_charge_id', $charge->id)->count())->toBe(1);
    });

    it('silently skips an overdue charge (does not throw like the manual controller would)', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'overdue']);

        (new GeneratePaymentForChargeJob($charge->id))->handle(app(GeneratePaymentSlipService::class));

        expect(PaymentSlip::where('customer_charge_id', $charge->id)->count())->toBe(0);
    });

    it('does nothing for a charge that no longer exists', function () {
        (new GeneratePaymentForChargeJob(999999))->handle(app(GeneratePaymentSlipService::class));

        expect(PaymentSlip::count())->toBe(0);
    });

    it('does nothing for a paid charge', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'paid']);

        (new GeneratePaymentForChargeJob($charge->id))->handle(app(GeneratePaymentSlipService::class));

        expect(PaymentSlip::where('customer_charge_id', $charge->id)->count())->toBe(0);
    });

    it('generates a new slip once the previous one has been cancelled', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices' => Http::response(['id' => 'inv-2', 'status' => 'OPEN'], 201),
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'status' => 'cancelled']);

        (new GeneratePaymentForChargeJob($charge->id))->handle(app(GeneratePaymentSlipService::class));

        expect(PaymentSlip::where('customer_charge_id', $charge->id)->count())->toBe(2);
    });

});
