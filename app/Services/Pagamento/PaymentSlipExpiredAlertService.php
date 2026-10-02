<?php

namespace App\Services\Pagamento;

use App\Models\Cobranca\CustomerCharge;
use App\Services\Alert\ResolveOperationalAlertService;
use App\Services\Alert\UpsertOperationalAlertService;

class PaymentSlipExpiredAlertService
{
    public const TYPE = 'payment_slip_expired';

    public function __construct(
        private readonly UpsertOperationalAlertService $upsertAlertService,
        private readonly ResolveOperationalAlertService $resolveAlertService,
    ) {}

    // Reabre/renova o alerta (detected_at = agora): é também o "lembrete" periódico
    // enquanto ninguém emitir o novo boleto.
    public function notify(CustomerCharge $charge): void
    {
        $charge->loadMissing('clientProfile');
        $clientProfile = $charge->clientProfile;
        $expiredSlip = $charge->paymentSlips()->where('status', 'expired')->latest('id')->first();
        $expiredOn = $expiredSlip?->effectiveDueDate()?->format('d/m/Y');

        $this->upsertAlertService->handle([
            'module' => 'financeiro',
            'type' => self::TYPE,
            'client_profile_id' => $charge->client_profile_id,
            'reference_year' => $charge->reference_year,
            'reference_month' => $charge->reference_month,
            'severity' => 'error',
            'title' => 'Boleto vencido — gere um novo boleto e envie ao cliente',
            'message' => sprintf(
                'O boleto da cobrança %s (%s)%s venceu sem pagamento e não pode mais ser pago. Gere um novo boleto e envie ao cliente.',
                $charge->reference_label,
                $clientProfile?->nome ?? $clientProfile?->razao_social,
                $expiredOn ? " venceu em {$expiredOn}," : '',
            ),
            'usina_id' => $charge->usina_id,
            'assigned_to_user_id' => $clientProfile?->consultor_user_id,
            'payload' => [
                'customer_charge_id' => $charge->id,
                'payment_slip_id' => $expiredSlip?->id,
                'action_url' => route('admin.financeiro.cobrancas.show', $charge->id, false),
            ],
        ], $charge);
    }

    public function resolveFor(CustomerCharge $charge, string $notes): void
    {
        $this->resolveAlertService->resolveMatching([
            'module' => 'financeiro',
            'type' => self::TYPE,
            'alertable_type' => CustomerCharge::class,
            'alertable_id' => $charge->id,
        ], $notes);
    }
}
