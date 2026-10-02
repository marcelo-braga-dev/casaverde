<?php

use App\Jobs\GeneratePaymentForChargeJob;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Automation\PaymentAutomationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;

describe('PaymentAutomationService::generateMissingPayments', function () {

    beforeEach(function () {
        Queue::fake();
        $this->charge = CustomerCharge::factory()->create(['status' => 'open']);
    });

    it('does not dispatch jobs when there is no active default account for the automation provider', function () {
        Log::spy();
        PaymentProviderAccount::factory()->create([
            'provider' => 'mercado_pago',
            'is_active' => true,
            'is_default' => true,
        ]);

        app(PaymentAutomationService::class)->generateMissingPayments();

        Queue::assertNothingPushed();
        Log::shouldHaveReceived('warning')->once();
    });

    it('dispatches a job per open charge when the automation provider has a default account', function () {
        PaymentProviderAccount::factory()->create([
            'provider' => 'cora',
            'is_active' => true,
            'is_default' => true,
        ]);

        app(PaymentAutomationService::class)->generateMissingPayments();

        Queue::assertPushed(GeneratePaymentForChargeJob::class, fn ($job) => $job->chargeId === $this->charge->id);
    });
});
