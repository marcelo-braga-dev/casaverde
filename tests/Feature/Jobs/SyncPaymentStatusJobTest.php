<?php

use App\Exceptions\Payments\PaymentProviderException;
use App\Jobs\SyncPaymentStatusJob;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\SyncPaymentSlipService;
use Illuminate\Support\Facades\Log;

describe('SyncPaymentStatusJob', function () {

    beforeEach(function () {
        $account = PaymentProviderAccount::factory()->create(['provider' => 'mercado_pago']);

        $this->slip = PaymentSlip::factory()->create([
            'payment_provider_account_id' => $account->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'ORD111',
            'status' => 'generated',
        ]);
    });

    it('swallows transient provider errors so the next scheduled run retries', function (int $httpStatus) {
        Log::spy();

        $service = Mockery::mock(SyncPaymentSlipService::class);
        $service->shouldReceive('handle')->once()->andThrow(new PaymentProviderException('falha', $httpStatus));

        (new SyncPaymentStatusJob($this->slip->id))->handle($service);

        Log::shouldHaveReceived('warning')->once();
    })->with([429, 500, 503]);

    it('rethrows non-transient provider errors', function () {
        $service = Mockery::mock(SyncPaymentSlipService::class);
        $service->shouldReceive('handle')->once()->andThrow(new PaymentProviderException('não encontrado', 404));

        expect(fn () => (new SyncPaymentStatusJob($this->slip->id))->handle($service))
            ->toThrow(PaymentProviderException::class);
    });
});
