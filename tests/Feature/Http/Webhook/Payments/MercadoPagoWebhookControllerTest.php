<?php

use App\Jobs\Pagamento\ProcessPaymentWebhookJob;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentWebhookEvent;
use Illuminate\Support\Facades\Queue;

function postSignedMercadoPagoWebhook($test, array $payload)
{
    $ts = '1704908010';
    $requestId = 'req-1';
    $dataId = strtolower((string) ($payload['data']['id'] ?? ''));
    $hash = hash_hmac('sha256', "id:{$dataId};request-id:{$requestId};ts:{$ts};", 'my-secret');

    return $test->postJson('/webhooks/payments/mercado-pago', $payload, [
        'x-signature' => "ts={$ts},v1={$hash}",
        'x-request-id' => $requestId,
    ]);
}

describe('MercadoPagoWebhookController', function () {

    beforeEach(function () {
        $this->account = PaymentProviderAccount::factory()
            ->mercadoPago()
            ->withWebhookSecret('my-secret')
            ->create(['is_active' => true, 'is_default' => true]);
    });

    it('creates a payment webhook event and dispatches the processing job', function () {
        Queue::fake();

        $response = postSignedMercadoPagoWebhook($this, [
            'id' => 999001,
            'type' => 'payment',
            'data' => ['id' => '111'],
        ]);

        $response->assertOk()->assertJson(['ok' => true]);

        expect(PaymentWebhookEvent::count())->toBe(1);

        $event = PaymentWebhookEvent::first();
        expect($event->provider)->toBe('mercado_pago')
            ->and($event->event_id)->toBe('999001')
            ->and($event->event_type)->toBe('payment')
            ->and($event->provider_payment_id)->toBe('111')
            ->and($event->status)->toBe('received');

        Queue::assertPushed(ProcessPaymentWebhookJob::class, fn ($job) => $job->eventId === $event->id);
    });

    it('does not duplicate the event or re-dispatch the job when the same event_id is replayed', function () {
        Queue::fake();

        $payload = ['id' => 999001, 'type' => 'payment', 'data' => ['id' => '111']];

        postSignedMercadoPagoWebhook($this, $payload)->assertOk();
        postSignedMercadoPagoWebhook($this, $payload)->assertOk();

        expect(PaymentWebhookEvent::count())->toBe(1);
        Queue::assertPushed(ProcessPaymentWebhookJob::class, 1);
    });

    it('rejects the webhook with 401 when a webhook secret is configured and the signature is missing', function () {
        Queue::fake();

        $response = $this->postJson('/webhooks/payments/mercado-pago', [
            'id' => 999001,
            'type' => 'payment',
            'data' => ['id' => '111'],
        ]);

        $response->assertStatus(401);

        expect(PaymentWebhookEvent::count())->toBe(0);
        Queue::assertNotPushed(ProcessPaymentWebhookJob::class);
    });

    it('extracts the provider payment id from the legacy IPN resource URL format', function () {
        Queue::fake();

        $response = postSignedMercadoPagoWebhook($this, [
            'topic' => 'payment',
            'resource' => 'https://api.mercadopago.com/v1/payments/222',
        ]);

        $response->assertOk();

        $event = PaymentWebhookEvent::first();
        expect($event->provider_payment_id)->toBe('222')
            ->and($event->event_type)->toBe('payment');
    });

    it('rejects every webhook when the account has no webhook secret configured', function () {
        Queue::fake();
        $this->account->update(['webhook_secret' => null]);

        postSignedMercadoPagoWebhook($this, ['id' => 1, 'type' => 'order', 'data' => ['id' => 'ORD1']])
            ->assertStatus(401);

        expect(PaymentWebhookEvent::count())->toBe(0);
    });
});
