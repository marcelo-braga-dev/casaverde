<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Repositories\Pagamento\PaymentWebhookEventRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentWebhookEventController extends Controller
{
    public function index(Request $request, PaymentWebhookEventRepository $repository)
    {
        $filters = $request->only([
            'provider',
            'status',
            'event_type',
            'provider_payment_id',
        ]);

        return Inertia::render('Admin/Financeiro/Pagamento/Webhook/Index/Page', [
            'events' => $repository->paginate($filters, 20),
            'filters' => $filters,
            'statuses' => ['received', 'processed', 'ignored', 'failed'],
            'providers' => ['cora'],
        ]);
    }

    public function show(PaymentWebhookEvent $webhook)
    {
        return Inertia::render('Admin/Financeiro/Pagamento/Webhook/Show/Page', [
            'event' => $webhook->load([
                'paymentSlip.charge.clientProfile',
                'paymentSlip.providerAccount',
            ]),
        ]);
    }
}
