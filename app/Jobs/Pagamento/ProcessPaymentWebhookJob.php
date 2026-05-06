<?php

namespace App\Jobs\Pagamento;

use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Pagamento\ProcessPaymentWebhookService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPaymentWebhookJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly int $eventId,
    ) {
    }

    public function handle(ProcessPaymentWebhookService $service): void
    {
        $event = PaymentWebhookEvent::query()->findOrFail($this->eventId);

        $service->handle($event);
    }
}
