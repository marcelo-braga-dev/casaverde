<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentTransaction;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Pagamento\MarkPaymentAsPaidService;
use App\Services\Pagamento\ProcessPaymentWebhookService;

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

    it('marks the slip as cancelled when the webhook reports cancellation', function () {
        $slip = PaymentSlip::factory()->create([
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
            ->and($event->refresh()->status)->toBe('processed');
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

});
