<?php

use App\Jobs\SendChargeReminderJob;
use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Automation\ChargeReminderService;
use App\Services\Automation\GenerateChargeReminderAlertService;
use App\Services\Automation\PaymentAutomationService;
use App\Services\Cobranca\UpdateCustomerChargeDueDateService;
use App\Services\Pagamento\GeneratePaymentSlipService;
use App\Services\Pagamento\PaymentSlipExpiredAlertService;
use App\Services\Pagamento\SyncPaymentSlipService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;

function barcodeDueOn(string $date): string
{
    $factor = 1000 + (int) CarbonImmutable::parse('2025-02-22')->diffInDays(CarbonImmutable::parse($date));

    return '34191'.$factor.str_repeat('1', 35);
}

function expiredAlertFor(CustomerCharge $charge): ?OperationalAlert
{
    return OperationalAlert::query()
        ->where('type', PaymentSlipExpiredAlertService::TYPE)
        ->where('alertable_id', $charge->id)
        ->first();
}

describe('Payment slip expiration', function () {

    beforeEach(function () {
        $this->travelTo('2026-10-02 06:00:00');
        $this->consultor = User::factory()->consultor()->create();
        $this->client = ClientProfile::factory()->create(['consultor_user_id' => $this->consultor->id]);
    });

    it('expires a slip whose barcode due date passed, even when due_date stored a later date', function () {
        $charge = CustomerCharge::factory()->create([
            'client_profile_id' => $this->client->id,
            'status' => 'open',
            'due_date' => '2026-10-12',
        ]);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'mercado_pago',
            'due_date' => '2026-10-12',
            'barcode' => barcodeDueOn('2026-10-01'),
        ]);

        $expired = app(PaymentAutomationService::class)->expireOverdueSlips();

        $alert = expiredAlertFor($charge);

        expect($expired)->toBe(1)
            ->and($slip->fresh()->status)->toBe('expired')
            ->and($charge->refresh()->status)->toBe('open')
            ->and($charge->isAguardandoNovoBoleto())->toBeTrue()
            ->and($alert->assigned_to_user_id)->toBe($this->consultor->id)
            ->and($alert->title)->toContain('gere um novo boleto')
            ->and($alert->payload['customer_charge_id'])->toBe($charge->id);
        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'action' => 'payment_slip_expired',
        ]);
    });

    it('marks the charge as overdue when its own due date has also passed', function () {
        $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'open', 'due_date' => '2026-09-30']);
        PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'due_date' => '2026-09-30']);

        app(PaymentAutomationService::class)->expireOverdueSlips();

        expect($charge->refresh()->status)->toBe('overdue');
    });

    it('keeps slips that are still payable today untouched', function () {
        $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'open']);
        $slip = PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'due_date' => '2026-10-02']);

        app(PaymentAutomationService::class)->expireOverdueSlips();

        expect($slip->fresh()->status)->toBe('generated')
            ->and(expiredAlertFor($charge))->toBeNull();
    });

    it('re-notifies every 5 days while no new boleto is issued and skips the plain overdue reminder', function () {
        Queue::fake();
        $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'overdue', 'due_date' => '2026-09-20']);
        PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'status' => 'expired', 'due_date' => '2026-09-20']);

        app(PaymentSlipExpiredAlertService::class)->notify($charge);
        app(ChargeReminderService::class)->sendDueReminders();
        Queue::assertNothingPushed();

        $this->travel(5)->days();
        app(ChargeReminderService::class)->sendDueReminders();

        Queue::assertPushed(SendChargeReminderJob::class, 1);
        Queue::assertPushed(SendChargeReminderJob::class, fn ($job) => $job->reason === 'payment_slip_expired');
    });

    it('reopens an ignored alert on the next cycle', function () {
        $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'overdue']);
        PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'status' => 'expired']);
        app(PaymentSlipExpiredAlertService::class)->notify($charge);
        expiredAlertFor($charge)->update(['status' => 'ignored']);

        $this->travel(6)->days();
        (new SendChargeReminderJob($charge->id, 'payment_slip_expired'))->handle(
            app(GenerateChargeReminderAlertService::class),
            app(PaymentSlipExpiredAlertService::class),
        );

        expect(expiredAlertFor($charge)->status->value)->toBe('open');
    });

    it('lets an overdue charge get a new boleto, resolving the alert', function () {
        Http::fake([
            'mp.test/v1/orders' => Http::response(mpOrder('inv-new', 'action_required'), 201),
        ]);
        mercadoPagoAccount();

        $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'overdue']);
        PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'status' => 'expired']);
        app(PaymentSlipExpiredAlertService::class)->notify($charge);

        app(GeneratePaymentSlipService::class)->handle($charge);

        expect($charge->isAguardandoNovoBoleto())->toBeFalse()
            ->and(expiredAlertFor($charge)->status->value)->toBe('resolved');
    });

    it('records a late-compensated payment of the expired slip and cancels the replacement', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->create(['base_url' => 'https://mp.test', 'is_default' => false]);
        Http::fake([
            'mp.test/v1/orders/ORD-OLD' => Http::response(['id' => 'ORD-OLD', 'status' => 'processed', 'status_detail' => 'accredited', 'total_paid_amount' => '250.00'], 200),
            'mp.test/v1/orders/ORD-NEW/cancel' => Http::response(['id' => 'ORD-NEW', 'status' => 'canceled'], 200),
        ]);

        $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'open']);
        $expired = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'ORD-OLD',
            'status' => 'expired',
        ]);
        $replacement = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'ORD-NEW',
            'status' => 'generated',
        ]);

        app(SyncPaymentSlipService::class)->handle($expired);

        expect($expired->fresh()->status)->toBe('paid')
            ->and($charge->refresh()->status)->toBe('paid')
            ->and($replacement->fresh()->status)->toBe('cancelled');
    });

    it('keeps an expired slip expired while the provider still shows it as open', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->create(['base_url' => 'https://mp.test', 'is_default' => false]);
        Http::fake(['mp.test/v1/orders/ORD-OLD' => Http::response(['id' => 'ORD-OLD', 'status' => 'action_required'], 200)]);

        $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'open']);
        $expired = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $account->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'ORD-OLD',
            'status' => 'expired',
        ]);

        app(SyncPaymentSlipService::class)->handle($expired);

        expect($expired->fresh()->status)->toBe('expired');
    });

    it('reopens an overdue charge when its due date is moved to the future', function () {
        $this->actingAs(User::factory()->admin()->create());
        $charge = CustomerCharge::factory()->create(['status' => 'overdue', 'due_date' => '2026-09-20']);

        app(UpdateCustomerChargeDueDateService::class)->handle($charge, '2026-10-15');

        expect($charge->refresh()->status)->toBe('open');
    });
});
