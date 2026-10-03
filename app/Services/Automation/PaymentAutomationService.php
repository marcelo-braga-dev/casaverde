<?php

namespace App\Services\Automation;

use App\Jobs\MarkChargeAsOverdueJob;
use App\Jobs\SyncPaymentStatusJob;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\ExpirePaymentSlipService;

class PaymentAutomationService
{
    // Boleto pago no dia do vencimento leva até 3 dias úteis para compensar; o slip
    // vencido segue sendo sincronizado por esse período para não perder o pagamento.
    private const EXPIRED_SYNC_GRACE_DAYS = 10;

    public function __construct(
        private readonly ExpirePaymentSlipService $expirePaymentSlipService,
    ) {}

    public function markOverdueCharges(): void
    {
        CustomerCharge::query()
            ->whereIn('status', ['open', 'waiting_payment'])
            ->whereDate('due_date', '<', now())
            ->chunkById(100, function ($charges) {
                foreach ($charges as $charge) {
                    MarkChargeAsOverdueJob::dispatch($charge->id);
                }
            });
    }

    public function syncPendingPayments(): void
    {
        PaymentSlip::query()
            ->where(function ($query) {
                $query->whereIn('status', ['pending', 'generated'])
                    ->orWhere(fn ($q) => $q
                        ->where('status', 'expired')
                        ->whereDate('due_date', '>=', now()->subDays(self::EXPIRED_SYNC_GRACE_DAYS)));
            })
            ->chunkById(100, function ($payments) {
                foreach ($payments as $payment) {
                    SyncPaymentStatusJob::dispatch($payment->id);
                }
            });
    }

    public function expireOverdueSlips(): int
    {
        $expired = 0;

        // A data efetiva vem do código de barras, então o filtro é feito em PHP.
        PaymentSlip::query()
            ->with('charge')
            ->whereIn('status', ['pending', 'generated'])
            ->chunkById(100, function ($slips) use (&$expired) {
                foreach ($slips as $slip) {
                    if ($slip->effectiveDueDate()?->lt(today())) {
                        $this->expirePaymentSlipService->handle($slip);
                        $expired++;
                    }
                }
            });

        return $expired;
    }
}
