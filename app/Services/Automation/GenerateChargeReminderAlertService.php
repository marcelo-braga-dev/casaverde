<?php

namespace App\Services\Automation;

use App\Enums\Alert\OperationalAlertStatus;
use App\Models\Alert\OperationalAlert;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Alert\UpsertOperationalAlertService;
use App\Services\WhatsApp\WhatsAppLinkService;

class GenerateChargeReminderAlertService
{
    public function __construct(
        private readonly WhatsAppLinkService $whatsAppLinkService,
        private readonly UpsertOperationalAlertService $upsertAlertService,
    ) {}

    public function handle(CustomerCharge $charge, string $reason): void
    {
        $charge->loadMissing('clientProfile.consultor', 'clientProfile.contacts');

        $templateKey = $reason === 'overdue' ? 'fatura_vencida' : 'lembrete_vencimento';
        $alertType = $reason === 'overdue' ? 'charge_overdue_reminder' : 'charge_upcoming_due_reminder';

        $unique = [
            'module' => 'financeiro',
            'type' => $alertType,
            'client_profile_id' => $charge->client_profile_id,
            'reference_year' => $charge->reference_year,
            'reference_month' => $charge->reference_month,
        ];

        $existing = OperationalAlert::query()
            ->where($unique)
            ->where('alertable_type', CustomerCharge::class)
            ->where('alertable_id', $charge->id)
            ->first();

        if ($existing && $existing->status === OperationalAlertStatus::Resolved) {
            $charge->update(['reminder_sent_at' => now()]);

            return;
        }

        $clientProfile = $charge->clientProfile;
        $phone = $clientProfile?->contacts?->celular ?? $clientProfile?->contacts?->telefone;

        $whatsapp = $this->whatsAppLinkService->linkForTemplate($templateKey, [
            'cliente_nome' => $clientProfile?->nome ?? $clientProfile?->razao_social,
            'mes_referencia' => $charge->reference_label,
            'valor_fatura' => number_format((float) $charge->final_amount, 2, ',', '.'),
            'data_vencimento' => $charge->due_date?->format('d/m/Y'),
        ], $phone);

        $this->upsertAlertService->handle([
            ...$unique,
            'severity' => $reason === 'overdue' ? 'error' : 'warning',
            'title' => $reason === 'overdue'
                ? 'Cobrança vencida — lembrete ao cliente'
                : 'Cobrança próxima do vencimento — lembrete ao cliente',
            'message' => sprintf(
                'Cobrança %s (%s) — envie o lembrete pelo WhatsApp.',
                $charge->reference_label,
                $clientProfile?->nome ?? $clientProfile?->razao_social,
            ),
            'usina_id' => $charge->usina_id,
            'assigned_to_user_id' => $clientProfile?->consultor_user_id,
            'payload' => [
                'customer_charge_id' => $charge->id,
                'whatsapp_message' => $whatsapp['message'] ?? null,
                'whatsapp_link' => $whatsapp['link'] ?? null,
            ],
        ], $charge);

        $charge->update(['reminder_sent_at' => now()]);
    }
}
