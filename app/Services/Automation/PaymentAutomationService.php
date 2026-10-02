<?php

namespace App\Services\Automation;

use App\Jobs\GeneratePaymentForChargeJob;
use App\Jobs\MarkChargeAsOverdueJob;
use App\Jobs\SyncPaymentStatusJob;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\PaymentProviderManager;
use Illuminate\Support\Facades\Log;

class PaymentAutomationService
{
    // GeneratePaymentForChargeJob chama GeneratePaymentSlipService com o provider padrão dele.
    private const AUTOMATION_PROVIDER = 'cora';

    public function __construct(
        private readonly PaymentProviderManager $providerManager,
    ) {}

    public function generateMissingPayments(): void
    {
        // Sem conta ativa, cada job falhava com ModelNotFoundException (que o Laravel não
        // reporta no log), enchendo failed_jobs a cada hora com uma entrada por cobrança aberta.
        if (! $this->providerManager->hasDefaultAccount(self::AUTOMATION_PROVIDER)) {
            Log::warning('[PaymentAutomation] Geração automática de pagamentos ignorada: nenhuma conta padrão ativa para o provider "'.self::AUTOMATION_PROVIDER.'".');

            return;
        }

        CustomerCharge::query()
            ->whereIn('status', ['open', 'waiting_payment'])
            ->chunkById(100, function ($charges) {
                foreach ($charges as $charge) {
                    GeneratePaymentForChargeJob::dispatch($charge->id);
                }
            });
    }

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
            ->whereIn('status', ['pending', 'generated'])
            ->chunkById(100, function ($payments) {
                foreach ($payments as $payment) {
                    SyncPaymentStatusJob::dispatch($payment->id);
                }
            });
    }
}
