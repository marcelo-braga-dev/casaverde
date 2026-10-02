<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Cobranca\AddCustomerChargeAdjustmentService;
use Illuminate\Support\Facades\Http;

describe('AddCustomerChargeAdjustmentService', function () {

    beforeEach(function () {
        $this->actingAs(User::factory()->admin()->create());
    });

    it('recalculates the charge and reissues the active slip with the new amount', function () {
        Http::fake([
            'cora.test/oauth/token' => Http::response(['access_token' => 'token-123'], 200),
            'cora.test/invoices/inv-old' => Http::response([], 204),
            'cora.test/invoices' => Http::response(['id' => 'inv-new', 'status' => 'OPEN'], 201),
        ]);

        $account = PaymentProviderAccount::factory()->create(['base_url' => 'https://cora.test']);
        $charge = CustomerCharge::factory()->create([
            'status' => 'open',
            'original_amount' => 300,
            'discount_amount' => 0,
            'final_amount' => 300,
        ]);
        $oldSlip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider_payment_id' => 'inv-old',
            'amount' => 300,
            'status' => 'generated',
        ]);

        $result = app(AddCustomerChargeAdjustmentService::class)
            ->handle($charge, ['type' => 'discount', 'amount' => 50, 'description' => 'Acordo'], auth()->id());

        $newSlip = $charge->paymentSlips()->where('status', 'generated')->sole();

        expect((float) $result->final_amount)->toBe(250.0)
            ->and($oldSlip->fresh()->status)->toBe('cancelled')
            ->and((float) $newSlip->amount)->toBe(250.0);
    });

    it('just recalculates when there is no active slip', function () {
        $charge = CustomerCharge::factory()->create([
            'status' => 'open',
            'original_amount' => 300,
            'discount_amount' => 0,
            'final_amount' => 300,
        ]);

        $result = app(AddCustomerChargeAdjustmentService::class)
            ->handle($charge, ['type' => 'addition', 'amount' => 20], auth()->id());

        expect((float) $result->final_amount)->toBe(320.0)
            ->and($charge->paymentSlips()->count())->toBe(0);
    });
});
