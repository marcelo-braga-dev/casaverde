<?php

use App\Jobs\Pagamento\ProcessPaymentWebhookJob;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentWebhookEvent;
use Illuminate\Support\Facades\Queue;

describe('CoraWebhookController', function () {

    it('creates a payment webhook event and dispatches the processing job', function () {
        Queue::fake();

        $response = $this->postJson('/webhooks/payments/cora', [
            'id' => 'evt-1',
            'event' => 'invoice.paid',
            'invoice' => ['id' => 'inv-1', 'status' => 'PAID'],
        ]);

        $response->assertOk()->assertJson(['ok' => true]);

        expect(PaymentWebhookEvent::count())->toBe(1);

        $event = PaymentWebhookEvent::first();
        expect($event->provider)->toBe('cora')
            ->and($event->event_id)->toBe('evt-1')
            ->and($event->event_type)->toBe('invoice.paid')
            ->and($event->provider_payment_id)->toBe('inv-1')
            ->and($event->status)->toBe('received');

        Queue::assertPushed(ProcessPaymentWebhookJob::class, fn ($job) => $job->eventId === $event->id);
    });

    it('does not duplicate the event or re-dispatch the job when the same event_id is replayed', function () {
        Queue::fake();

        $payload = ['id' => 'evt-1', 'event' => 'invoice.paid', 'invoice' => ['id' => 'inv-1', 'status' => 'PAID']];

        $this->postJson('/webhooks/payments/cora', $payload)->assertOk();
        $this->postJson('/webhooks/payments/cora', $payload)->assertOk();

        expect(PaymentWebhookEvent::count())->toBe(1);
        Queue::assertPushed(ProcessPaymentWebhookJob::class, 1);
    });

    it('rejects the webhook with 401 when a webhook secret is configured and the signature is missing', function () {
        Queue::fake();

        PaymentProviderAccount::factory()
            ->withWebhookSecret('my-secret')
            ->create(['provider' => 'cora', 'is_active' => true, 'is_default' => true]);

        $response = $this->postJson('/webhooks/payments/cora', [
            'id' => 'evt-1',
            'event' => 'invoice.paid',
        ]);

        $response->assertStatus(401);

        expect(PaymentWebhookEvent::count())->toBe(0);
        Queue::assertNotPushed(ProcessPaymentWebhookJob::class);
    });

});
