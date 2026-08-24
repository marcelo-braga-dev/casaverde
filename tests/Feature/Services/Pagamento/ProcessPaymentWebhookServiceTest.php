<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentTransaction;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Pagamento\MarkPaymentAsPaidService;
use App\Services\Pagamento\ProcessPaymentWebhookService;
use Illuminate\Support\Facades\Http;

describe('ProcessPaymentWebhookService', function () {

    beforeEach(function () {
        $this->service = app(ProcessPaymentWebhookService::class);
    });

    it('marks the slip and charge as paid when the webhook reports payment', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'waiting_payment']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-1',
            'status' => 'generated',
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-1',
            'payload' => [
                'invoice' => ['id' => 'inv-1', 'status' => 'PAID', 'paid_amount' => 25000, 'paid_at' => '2026-06-22T10:00:00Z'],
                'transaction' => ['id' => 'txn-1'],
            ],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('processed')
            ->and($slip->refresh()->status)->toBe('paid')
            ->and($charge->refresh()->status)->toBe('paid')
            ->and(PaymentTransaction::where('payment_slip_id', $slip->id)->count())->toBe(1);
    });

    it('marks the slip as cancelled when the webhook reports cancellation, and reopens an open charge', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-2',
            'status' => 'generated',
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-2',
            'payload' => ['invoice' => ['id' => 'inv-2', 'status' => 'CANCELLED']],
        ]);

        $this->service->handle($event);

        expect($slip->refresh()->status)->toBe('cancelled')
            ->and($event->refresh()->status)->toBe('processed')
            ->and($charge->refresh()->status)->toBe('open');
    });

    it('marks the slip as expired when the webhook reports expiration', function () {
        $slip = PaymentSlip::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-3',
            'status' => 'generated',
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-3',
            'payload' => ['invoice' => ['id' => 'inv-3', 'status' => 'EXPIRED']],
        ]);

        $this->service->handle($event);

        expect($slip->refresh()->status)->toBe('expired')
            ->and($event->refresh()->status)->toBe('processed');
    });

    it('reopens an overdue charge when the webhook reports cancellation, unblocking reissue', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'overdue']);
        PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-2b',
            'status' => 'generated',
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-2b',
            'payload' => ['invoice' => ['id' => 'inv-2b', 'status' => 'CANCELLED']],
        ]);

        $this->service->handle($event);

        expect($charge->refresh()->status)->toBe('open');
    });

    it('reopens an overdue charge when the webhook reports expiration, unblocking reissue', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'overdue']);
        PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-3b',
            'status' => 'generated',
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-3b',
            'payload' => ['invoice' => ['id' => 'inv-3b', 'status' => 'EXPIRED']],
        ]);

        $this->service->handle($event);

        expect($charge->refresh()->status)->toBe('open');
    });

    it('does not reopen the charge via webhook cancellation when it is already paid', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'paid']);
        PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'cora',
            'provider_payment_id' => 'inv-2c',
            'status' => 'generated',
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-2c',
            'payload' => ['invoice' => ['id' => 'inv-2c', 'status' => 'CANCELLED']],
        ]);

        $this->service->handle($event);

        expect($charge->refresh()->status)->toBe('paid');
    });

    it('ignores the event without raising an exception when no matching slip exists', function () {
        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-unknown',
            'payload' => ['invoice' => ['id' => 'inv-unknown', 'status' => 'PAID']],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('ignored')
            ->and($result->error_message)->toBe('Pagamento não encontrado no sistema.');
    });

    it('ignores the event when there is no provider payment id in the payload', function () {
        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => null,
            'payload' => ['status' => 'PAID'],
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

    it('marks the event as failed and rethrows when an unexpected error occurs', function () {
        PaymentSlip::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-4',
            'status' => 'generated',
        ]);

        $this->mock(MarkPaymentAsPaidService::class, function ($mock) {
            $mock->shouldReceive('handle')->andThrow(new RuntimeException('Falha simulada.'));
        });

        $service = app(ProcessPaymentWebhookService::class);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-4',
            'payload' => ['invoice' => ['id' => 'inv-4', 'status' => 'PAID']],
        ]);

        expect(fn () => $service->handle($event))->toThrow(RuntimeException::class, 'Falha simulada.');

        expect($event->refresh()->status)->toBe('failed')
            ->and($event->error_message)->toBe('Falha simulada.');
    });

    it('ignores the event when the status does not require operational action', function () {
        $slip = PaymentSlip::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-5',
            'status' => 'generated',
        ]);

        $event = PaymentWebhookEvent::factory()->create([
            'provider' => 'cora',
            'provider_payment_id' => 'inv-5',
            'payload' => ['invoice' => ['id' => 'inv-5', 'status' => 'PENDING']],
        ]);

        $result = $this->service->handle($event);

        expect($result->status)->toBe('ignored')
            ->and($result->error_message)->toBe('Status não exige ação operacional.')
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
