<?php

use App\Enums\Alert\OperationalAlertStatus;
use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;
use App\Models\WhatsApp\WhatsAppMessageTemplate;
use App\Services\Automation\ChargeReminderService;

describe('ChargeReminderService', function () {

    beforeEach(function () {
        $this->service = app(ChargeReminderService::class);

        WhatsAppMessageTemplate::create([
            'key' => 'lembrete_vencimento',
            'name' => 'Lembrete de vencimento',
            'category' => 'Financeiro',
            'message' => 'Olá {{cliente_nome}}, fatura {{mes_referencia}} de {{valor_fatura}} vence em {{data_vencimento}}.',
            'available_variables' => ['cliente_nome', 'mes_referencia', 'valor_fatura', 'data_vencimento'],
            'is_active' => true,
        ]);

        WhatsAppMessageTemplate::create([
            'key' => 'fatura_vencida',
            'name' => 'Fatura vencida',
            'category' => 'Financeiro',
            'message' => 'Olá {{cliente_nome}}, fatura {{mes_referencia}} de {{valor_fatura}} venceu em {{data_vencimento}}.',
            'available_variables' => ['cliente_nome', 'mes_referencia', 'valor_fatura', 'data_vencimento'],
            'is_active' => true,
        ]);
    });

    it('sends an upcoming due reminder once for a charge due in 3 days', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);

        $charge = CustomerCharge::factory()->open()->create([
            'client_profile_id' => $client->id,
            'due_date' => now()->addDays(3)->toDateString(),
        ]);

        $this->service->sendDueReminders();

        $charge->refresh();
        expect($charge->reminder_sent_at)->not->toBeNull();

        $alert = OperationalAlert::query()
            ->where('type', 'charge_upcoming_due_reminder')
            ->where('client_profile_id', $client->id)
            ->first();

        expect($alert)->not->toBeNull()
            ->and($alert->assigned_to_user_id)->toBe($consultor->id)
            ->and($alert->payload['whatsapp_link'])->toContain('wa.me');
    });

    it('does not duplicate the reminder when run again the same day', function () {
        $client = ClientProfile::factory()->create();
        $charge = CustomerCharge::factory()->open()->create([
            'client_profile_id' => $client->id,
            'due_date' => now()->addDays(3)->toDateString(),
        ]);

        $this->service->sendDueReminders();
        $this->service->sendDueReminders();

        expect(OperationalAlert::query()->where('type', 'charge_upcoming_due_reminder')->count())->toBe(1);
    });

    it('does not send upcoming reminder for charges due in more than 3 days', function () {
        $client = ClientProfile::factory()->create();
        CustomerCharge::factory()->open()->create([
            'client_profile_id' => $client->id,
            'due_date' => now()->addDays(10)->toDateString(),
        ]);

        $this->service->sendDueReminders();

        expect(OperationalAlert::query()->where('type', 'charge_upcoming_due_reminder')->exists())->toBeFalse();
    });

    it('sends an overdue reminder and resends after 5 days', function () {
        $client = ClientProfile::factory()->create();
        $charge = CustomerCharge::factory()->overdue()->create([
            'client_profile_id' => $client->id,
            'due_date' => now()->subDays(10)->toDateString(),
        ]);

        $this->service->sendDueReminders();
        $charge->refresh();
        $firstSentAt = $charge->reminder_sent_at;
        expect($firstSentAt)->not->toBeNull();

        // Resend should not happen immediately after.
        $this->service->sendDueReminders();
        $charge->refresh();
        expect($charge->reminder_sent_at->equalTo($firstSentAt))->toBeTrue();

        // Simulate 5+ days passing since the last reminder.
        $forcedOldDate = now()->subDays(6);
        $charge->update(['reminder_sent_at' => $forcedOldDate]);
        $this->service->sendDueReminders();
        $charge->refresh();

        expect($charge->reminder_sent_at->equalTo($forcedOldDate))->toBeFalse()
            ->and(OperationalAlert::query()->where('type', 'charge_overdue_reminder')->count())->toBe(1);
    });

    it('never sends a reminder for draft, paid or cancelled charges', function () {
        $client = ClientProfile::factory()->create();
        CustomerCharge::factory()->draft()->create(['client_profile_id' => $client->id, 'due_date' => now()->addDays(3)]);
        CustomerCharge::factory()->paid()->create(['client_profile_id' => $client->id, 'due_date' => now()->subDays(5)]);
        CustomerCharge::factory()->cancelled()->create(['client_profile_id' => $client->id, 'due_date' => now()->subDays(5)]);

        $this->service->sendDueReminders();

        expect(OperationalAlert::query()->where('module', 'financeiro')->whereIn('type', [
            'charge_upcoming_due_reminder', 'charge_overdue_reminder',
        ])->exists())->toBeFalse();
    });

    it('does not reopen an alert that was already resolved manually', function () {
        $client = ClientProfile::factory()->create();
        $charge = CustomerCharge::factory()->overdue()->create([
            'client_profile_id' => $client->id,
            'due_date' => now()->subDays(10)->toDateString(),
        ]);

        $this->service->sendDueReminders();

        $alert = OperationalAlert::query()->where('type', 'charge_overdue_reminder')->first();
        $alert->update([
            'status' => OperationalAlertStatus::Resolved,
            'resolved_at' => now(),
        ]);

        $charge->update(['reminder_sent_at' => now()->subDays(6)]);
        $this->service->sendDueReminders();

        $alert->refresh();
        expect($alert->status)->toBe(OperationalAlertStatus::Resolved)
            ->and($alert->resolved_at)->not->toBeNull();
    });

});
