<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Jobs\Pagamento\ProcessPaymentWebhookJob;
use App\Models\Pagamento\PaymentWebhookEvent;

class ReprocessPaymentWebhookEventController extends Controller
{
    public function store(PaymentWebhookEvent $webhook)
    {
        if (!$webhook->canBeReprocessed()) {
            return redirect()
                ->back()
                ->with('warning', 'Este webhook não pode ser reprocessado.');
        }

        $webhook->update([
            'status' => 'received',
            'error_message' => null,
            'processed_at' => null,
        ]);

        ProcessPaymentWebhookJob::dispatch($webhook->id);

        return redirect()
            ->back()
            ->with('success', 'Webhook enviado para reprocessamento.');
    }
}
