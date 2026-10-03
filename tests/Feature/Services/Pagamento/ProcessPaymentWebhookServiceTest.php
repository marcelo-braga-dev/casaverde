<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Pagamento\ProcessPaymentWebhookService;
use Illuminate\Support\Facades\Http;

describe('ProcessPaymentWebhookService', function () {

    beforeEach(function () {
        $this->service = app(ProcessPaymentWebhookService::class);
    });

    it('ignores the event without raising an exception when no matching slip exists', function () {
        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'inv-unknown',
            'payload' => ['type' => 'order', 'data' => ['id' => 'inv-unknown']],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('ignored')
            ->and($result->error_message)->toBe('Pagamento não encontrado no sistema.');
    });

    it('ignores the event when there is no provider payment id in the payload', function () {
        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'mercado_pago',
            'provider_payment_id' => null,
            'payload' => ['type' => 'order'],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('ignored')
            ->and($result->error_message)->toBe('Webhook sem ID do pagamento no provider.');
    });

    it('is idempotent and does nothing when the event was already processed', function () {
        $event = PaymentWebhookEvent::factory()->create([
            'status' => 'processed',
            'attempts' => 1,
        ]);

        $result = $this->service->handle($event);

        expect($result->is($event))->toBeTrue()
            ->and($result->attempts)->toBe(1);
    });

    it('marks the slip as cancelled when the API reports cancellation, and reopens an open charge', function () {
        $account = mercadoPagoAccount();
        Http::fake(['mp.test/v1/orders/ORD2' => Http::response(mpOrder('ORD2', 'canceled'), 200)]);

        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider_payment_id' => 'ORD2',
            'status' => 'generated',
        ]);
        $event = PaymentWebhookEvent::factory()->create(['provider_payment_id' => 'ORD2']);

        $this->service->handle($event);

        expect($slip->refresh()->status)->toBe('cancelled')
            ->and($event->refresh()->status)->toBe('processed')
            ->and($charge->refresh()->status)->toBe('open');
    });

    it('reopens an overdue charge when the API reports the order expired, unblocking reissue', function () {
        $account = mercadoPagoAccount();
        Http::fake(['mp.test/v1/orders/ORD3' => Http::response(mpOrder('ORD3', 'expired'), 200)]);

        $charge = CustomerCharge::factory()->create(['status' => 'overdue']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider_payment_id' => 'ORD3',
            'status' => 'generated',
        ]);
        $event = PaymentWebhookEvent::factory()->create(['provider_payment_id' => 'ORD3']);

        $this->service->handle($event);

        expect($slip->refresh()->status)->toBe('expired')
            ->and($charge->refresh()->status)->toBe('open');
    });

    it('does not reopen a paid charge when a later notification reports cancellation', function () {
        $account = mercadoPagoAccount();
        Http::fake(['mp.test/v1/orders/ORD4' => Http::response(mpOrder('ORD4', 'canceled'), 200)]);

        $charge = CustomerCharge::factory()->create(['status' => 'paid']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider_payment_id' => 'ORD4',
            'status' => 'generated',
        ]);
        $event = PaymentWebhookEvent::factory()->create(['provider_payment_id' => 'ORD4']);

        $this->service->handle($event);

        expect($charge->refresh()->status)->toBe('paid');
    });

    it('marks the event as failed and rethrows when the provider API fails', function () {
        $account = mercadoPagoAccount();
        Http::fake(['mp.test/v1/orders/ORD5' => Http::response(['message' => 'boom'], 500)]);

        $slip = PaymentSlip::factory()->create([
            'payment_provider_account_id' => $account->id,
            'provider_payment_id' => 'ORD5',
            'status' => 'generated',
        ]);
        $event = PaymentWebhookEvent::factory()->create(['provider_payment_id' => 'ORD5']);

        expect(fn () => $this->service->handle($event))->toThrow(RuntimeException::class);

        expect($event->refresh()->status)->toBe('failed')
            ->and($event->attempts)->toBe(1)
            ->and($slip->refresh()->status)->toBe('generated');
    });

    it('syncs with the Mercado Pago API and marks the slip as paid when approved', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->create([
            'base_url' => 'https://mp.test',
        ]);

        $charge = CustomerCharge::factory()->create(['status' => 'waiting_payment']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'ORD111',
            'status' => 'generated',
        ]);

        Http::fake([
            'mp.test/v1/orders/ORD111' => Http::response([
                'id' => 'ORD111',
                'status' => 'processed',
                'status_detail' => 'accredited',
                'total_paid_amount' => (string) $slip->amount,
                'last_updated_date' => '2026-06-22T10:00:00.000-03:00',
                'transactions' => [
                    'payments' => [
                        ['id' => 'PAY111', 'status' => 'processed', 'status_detail' => 'accredited', 'payment_method' => ['id' => 'pix', 'type' => 'bank_transfer']],
                    ],
                ],
            ], 200),
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'ORD111',
            'payload' => ['action' => 'order.processed', 'type' => 'order', 'data' => ['id' => 'ORD111']],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('processed')
            ->and($slip->refresh()->status)->toBe('paid')
            ->and($charge->refresh()->status)->toBe('paid');
    });

    it('does not mark the Mercado Pago slip as paid while the order is still processing', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->create([
            'base_url' => 'https://mp.test',
        ]);

        $slip = PaymentSlip::factory()->create([
            'payment_provider_account_id' => $account->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'ORD112',
            'status' => 'generated',
        ]);

        Http::fake([
            'mp.test/v1/orders/ORD112' => Http::response([
                'id' => 'ORD112',
                'status' => 'processing',
                'status_detail' => 'in_process',
                'total_paid_amount' => '0.00',
                'transactions' => [
                    'payments' => [
                        ['id' => 'PAY112', 'status' => 'processing', 'status_detail' => 'in_process', 'payment_method' => ['id' => 'bolbradesco', 'type' => 'ticket']],
                    ],
                ],
            ], 200),
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'ORD112',
            'payload' => ['action' => 'order.updated', 'type' => 'order', 'data' => ['id' => 'ORD112']],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('processed')
            ->and($slip->refresh()->status)->toBe('generated');
    });

    it('ignores the Mercado Pago event when no matching slip exists', function () {
        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'unknown',
            'payload' => ['action' => 'payment.updated', 'data' => ['id' => 'unknown']],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('ignored')
            ->and($result->error_message)->toBe('Pagamento não encontrado no sistema.');
    });

    it('ignores the Mercado Pago event when there is no provider payment id in the payload', function () {
        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'mercado_pago',
            'provider_payment_id' => null,
            'payload' => ['action' => 'payment.updated'],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('ignored')
            ->and($result->error_message)->toBe('Webhook sem ID do pagamento no provider.');
    });

});
