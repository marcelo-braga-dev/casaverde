<?php

namespace App\Http\Controllers\Webhook\Payments;

use App\Http\Controllers\Controller;
use App\Jobs\Pagamento\ProcessPaymentWebhookJob;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Pagamento\Providers\MercadoPago\MercadoPagoWebhookPayloadMapper;
use App\Services\Pagamento\Providers\MercadoPago\MercadoPagoWebhookSignatureValidator;
use Illuminate\Http\Request;

class MercadoPagoWebhookController extends Controller
{
    public function __invoke(
        Request $request,
        MercadoPagoWebhookPayloadMapper $mapper,
        MercadoPagoWebhookSignatureValidator $signatureValidator
    ) {
        $payload = $request->all();

        $account = PaymentProviderAccount::query()
            ->where('provider', 'mercado_pago')
            ->where('is_active', true)
            ->where('is_default', true)
            ->first();

        if (! $signatureValidator->isValid($request, $account)) {
            return response()->json([
                'ok' => false,
                'message' => 'Assinatura inválida.',
            ], 401);
        }

        $eventId = $mapper->eventId($payload);
        $providerPaymentId = $mapper->providerPaymentId($payload);

        $event = PaymentWebhookEvent::query()->firstOrCreate(
            [
                'provider' => 'mercado_pago',
                'event_id' => $eventId,
            ],
            [
                'event_type' => $mapper->eventType($payload),
                'provider_payment_id' => $providerPaymentId,
                'headers' => $request->headers->all(),
                'payload' => $payload,
                'status' => 'received',
            ]
        );

        if ($event->wasRecentlyCreated) {
            ProcessPaymentWebhookJob::dispatch($event->id);
        }

        return response()->json([
            'ok' => true,
            'event_id' => $event->id,
            'status' => $event->status,
        ]);
    }
}
