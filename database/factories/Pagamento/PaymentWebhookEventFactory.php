<?php

namespace Database\Factories\Pagamento;

use App\Models\Pagamento\PaymentWebhookEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentWebhookEventFactory extends Factory
{
    protected $model = PaymentWebhookEvent::class;

    public function definition(): array
    {
        return [
            'provider' => 'cora',
            'event_id' => 'evt-'.fake()->unique()->numerify('########'),
            'event_type' => 'invoice.paid',
            'payment_slip_id' => null,
            'provider_payment_id' => null,
            'headers' => [],
            'payload' => ['status' => 'PAID'],
            'status' => 'received',
            'attempts' => 0,
            'last_attempt_at' => null,
            'error_message' => null,
            'processed_at' => null,
        ];
    }
}
