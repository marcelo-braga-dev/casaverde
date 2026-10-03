<?php

use App\Exceptions\Payments\PaymentProviderException;
use App\Jobs\SyncPaymentStatusJob;
use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Models\Users\User;
use App\Services\Alert\OperationalHealthScanService;
use App\Services\Fatura\BillImportAlertService;
use App\Services\Fatura\Imap\ImapConcessionaireFetcherService;
use App\Services\Fatura\ImportAutomaticConcessionaireBillService;
use App\Services\Fatura\ProtectedPdfResolverService;
use App\Services\Pagamento\GeneratePaymentSlipService;
use App\Services\Pagamento\PaymentAlertService;
use App\Services\Pagamento\ProcessPaymentWebhookService;
use App\Services\Pagamento\SyncPaymentSlipService;
use Illuminate\Console\Events\ScheduledTaskFailed;
use Illuminate\Console\Scheduling\CacheEventMutex;
use Illuminate\Console\Scheduling\Event as ScheduledEvent;
use Illuminate\Contracts\Queue\Job;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

function openAlert(string $type): ?OperationalAlert
{
    return OperationalAlert::query()->where('type', $type)->whereIn('status', ['open', 'in_progress'])->first();
}

describe('Operational alerts for failures that compromise billing', function () {

    beforeEach(function () {
        $this->consultor = User::factory()->consultor()->create();
        $this->client = ClientProfile::factory()->create(['consultor_user_id' => $this->consultor->id]);
    });

    describe('bill import', function () {

        beforeEach(function () {
            Storage::fake('local');
            $this->setting = ClientEmailImportSetting::create([
                'client_profile_id' => $this->client->id,
                'user_id' => User::factory()->admin()->create()->id,
                'imap_host' => 'mail.example.com',
                'imap_port' => 993,
                'imap_encryption' => 'ssl',
                'imap_email' => 'faturas@example.com',
                'imap_password' => 'secret',
                'is_active' => true,
            ]);
        });

        it('alerts when the mailbox cannot be read and resolves once it works again', function () {
            $this->mock(ImapConcessionaireFetcherService::class, fn ($mock) => $mock
                ->shouldReceive('fetchMessages')->once()->andThrow(new RuntimeException('Falha ao conectar no IMAP')));

            app(ImportAutomaticConcessionaireBillService::class)->run();

            $alert = openAlert(BillImportAlertService::MAILBOX_FAILED);
            expect($alert)->not->toBeNull()
                ->and($alert->client_profile_id)->toBe($this->client->id)
                ->and($alert->message)->toContain('Falha ao conectar no IMAP');

            $this->mock(ImapConcessionaireFetcherService::class, fn ($mock) => $mock
                ->shouldReceive('fetchMessages')->once()->andReturn([]));

            app(ImportAutomaticConcessionaireBillService::class)->run();

            expect(openAlert(BillImportAlertService::MAILBOX_FAILED))->toBeNull();
        });

        it('alerts on a wrong PDF password', function () {
            $this->mock(ImapConcessionaireFetcherService::class, fn ($mock) => $mock
                ->shouldReceive('fetchMessages')->andReturn([[
                    'uid' => 'uid-1', 'message_id' => 'msg-1', 'from' => 'copel@example.com', 'subject' => 'Fatura',
                    'received_at' => now(), 'attachments' => [['filename' => 'fatura.pdf', 'content' => 'pdf-bytes']],
                ]]));
            $this->partialMock(ProtectedPdfResolverService::class, fn ($mock) => $mock
                ->shouldReceive('unlockToTempFile')->andThrow(new RuntimeException('Senha incorreta para desbloquear o PDF.')));

            app(ImportAutomaticConcessionaireBillService::class)->handle($this->client, $this->setting);

            $alert = openAlert(BillImportAlertService::PDF_PASSWORD);
            expect($alert)->not->toBeNull()
                ->and($alert->title)->toBe('Senha do PDF da fatura inválida')
                ->and($alert->message)->toContain('fatura.pdf');

            app(BillImportAlertService::class)->attachmentImported($this->setting);

            expect(openAlert(BillImportAlertService::PDF_PASSWORD))->toBeNull();
        });
    });

    describe('payments', function () {

        it('alerts the consultor when Mercado Pago refuses to create the payment, and resolves on success', function () {
            mercadoPagoAccount();
            Http::fake(['mp.test/v1/orders' => Http::sequence()
                ->push(['message' => 'invalid'], 400)
                ->push(mpOrder('ORD1'), 201)]);
            $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'open']);

            expect(fn () => app(GeneratePaymentSlipService::class)->handle($charge))->toThrow(PaymentProviderException::class);

            $alert = openAlert(PaymentAlertService::GENERATION_FAILED);
            expect($alert->assigned_to_user_id)->toBe($this->consultor->id)
                ->and($alert->payload['customer_charge_id'])->toBe($charge->id);

            app(GeneratePaymentSlipService::class)->handle($charge->refresh());

            expect(openAlert(PaymentAlertService::GENERATION_FAILED))->toBeNull();
        });

        it('raises a critical alert when Mercado Pago rejects the credentials', function () {
            mercadoPagoAccount();
            Http::fake(['mp.test/v1/orders' => Http::response(['message' => 'unauthorized'], 401)]);
            $charge = CustomerCharge::factory()->create(['status' => 'open']);

            expect(fn () => app(GeneratePaymentSlipService::class)->handle($charge))->toThrow(PaymentProviderException::class);

            expect(openAlert(PaymentAlertService::PROVIDER_AUTH_FAILED)->severity->value)->toBe('critical');
        });

        it('alerts when a payment cannot be synced and resolves after a successful sync', function () {
            $account = mercadoPagoAccount();
            $slip = PaymentSlip::factory()->create(['payment_provider_account_id' => $account->id, 'provider_payment_id' => 'ORD9']);

            Http::fake(['mp.test/v1/orders/ORD9' => Http::sequence()
                ->push(['message' => 'not found'], 404)
                ->push(mpOrder('ORD9'), 200)]);

            expect(fn () => (new SyncPaymentStatusJob($slip->id))->handle(app(SyncPaymentSlipService::class)))
                ->toThrow(PaymentProviderException::class);
            expect(openAlert(PaymentAlertService::SYNC_FAILED))->not->toBeNull();

            (new SyncPaymentStatusJob($slip->id))->handle(app(SyncPaymentSlipService::class));
            expect(openAlert(PaymentAlertService::SYNC_FAILED))->toBeNull();
        });

        it('alerts when a payment webhook fails to process', function () {
            $account = mercadoPagoAccount();
            PaymentSlip::factory()->create(['payment_provider_account_id' => $account->id, 'provider_payment_id' => 'ORD7']);
            Http::fake(['mp.test/v1/orders/ORD7' => Http::response(['message' => 'boom'], 500)]);
            $event = PaymentWebhookEvent::factory()->create(['provider_payment_id' => 'ORD7']);

            expect(fn () => app(ProcessPaymentWebhookService::class)->handle($event))->toThrow(RuntimeException::class);

            expect(openAlert(PaymentAlertService::WEBHOOK_FAILED)->module)->toBe('sistema');
        });
    });

    describe('infrastructure', function () {

        it('alerts when a queued job exhausts its retries', function () {
            $job = Mockery::mock(Job::class);
            $job->shouldReceive('resolveName')->andReturn('App\\Jobs\\SyncPaymentStatusJob');

            event(new JobFailed('database', $job, new RuntimeException('falhou')));

            expect(openAlert('queue_job_failed')->message)->toContain('SyncPaymentStatusJob');
        });

        it('alerts when a scheduled task fails', function () {
            $task = new ScheduledEvent(app(CacheEventMutex::class), "'/usr/bin/php83' 'artisan' casaverde:sync-payments");

            event(new ScheduledTaskFailed($task, new RuntimeException('exit code 1')));

            $alert = openAlert('scheduled_task_failed');
            expect($alert->severity->value)->toBe('critical')
                ->and($alert->message)->toContain('casaverde:sync-payments');
        });
    });

    describe('health scan', function () {

        it('groups charges stuck in draft per consultor and resolves when they are opened', function () {
            $charges = CustomerCharge::factory()->count(2)->create([
                'client_profile_id' => $this->client->id,
                'status' => 'draft',
                'created_at' => now()->subDays(3),
            ]);
            mercadoPagoAccount(['webhook_secret' => 'secret']);

            app(OperationalHealthScanService::class)->scan();

            $alert = openAlert(OperationalHealthScanService::CHARGES_DRAFT_PENDING);
            expect($alert->assigned_to_user_id)->toBe($this->consultor->id)
                ->and($alert->payload['count'])->toBe(2);

            $charges->each->update(['status' => 'open', 'due_date' => now()->addMonth()]);
            app(OperationalHealthScanService::class)->scan();

            expect(openAlert(OperationalHealthScanService::CHARGES_DRAFT_PENDING))->toBeNull();
        });

        it('keeps the per-consultor alert and the no-consultor alert apart', function () {
            CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'draft', 'created_at' => now()->subDays(3)]);
            CustomerCharge::factory()->count(2)->create([
                'client_profile_id' => ClientProfile::factory()->create(['consultor_user_id' => null])->id,
                'status' => 'draft',
                'created_at' => now()->subDays(3),
            ]);

            app(OperationalHealthScanService::class)->scan();

            $alerts = OperationalAlert::query()->where('type', OperationalHealthScanService::CHARGES_DRAFT_PENDING)->where('status', 'open')->get();
            expect($alerts)->toHaveCount(2)
                ->and($alerts->firstWhere('assigned_to_user_id', $this->consultor->id)->payload['count'])->toBe(1)
                ->and($alerts->firstWhere('alertable_id', null)->payload['count'])->toBe(2);
        });

        it('flags charges about to fall due with no boleto/Pix', function () {
            CustomerCharge::factory()->create([
                'client_profile_id' => $this->client->id,
                'status' => 'open',
                'due_date' => now()->addDays(2),
            ]);

            app(OperationalHealthScanService::class)->scan();

            expect(openAlert(OperationalHealthScanService::CHARGES_WITHOUT_PAYMENT)->assigned_to_user_id)->toBe($this->consultor->id);
        });

        it('flags a missing Mercado Pago account and a missing webhook secret', function () {
            app(OperationalHealthScanService::class)->scan();
            expect(openAlert(OperationalHealthScanService::PROVIDER_MISSING)->severity->value)->toBe('critical');

            mercadoPagoAccount(['webhook_secret' => null]);
            app(OperationalHealthScanService::class)->scan();

            expect(openAlert(OperationalHealthScanService::PROVIDER_MISSING))->toBeNull()
                ->and(openAlert(OperationalHealthScanService::WEBHOOK_SECRET_MISSING))->not->toBeNull();
        });

        it('flags payments that stopped being synced and bills waiting too long for review', function () {
            $account = mercadoPagoAccount(['webhook_secret' => 'secret']);
            PaymentSlip::factory()->create([
                'payment_provider_account_id' => $account->id,
                'generated_at' => now()->subHours(5),
                'response_payload' => ['synced_at' => now()->subHours(4)->toDateTimeString()],
            ]);
            ConcessionaireBill::factory()->create(['review_status' => 'pending_review', 'created_at' => now()->subDays(5)]);

            app(OperationalHealthScanService::class)->scan();

            expect(openAlert(OperationalHealthScanService::PAYMENT_SYNC_STALE)->payload['count'])->toBe(1)
                ->and(openAlert(OperationalHealthScanService::BILLS_REVIEW_OVERDUE))->not->toBeNull();
        });

        it('flags approved bills that never produced a charge, but not deliberately cancelled ones', function () {
            ConcessionaireBill::factory()->create(['review_status' => 'approved', 'updated_at' => now()->subHours(5)]);
            $cancelledBill = ConcessionaireBill::factory()->create(['review_status' => 'approved', 'updated_at' => now()->subHours(5)]);
            CustomerCharge::factory()->cancelled()->create(['concessionaire_bill_id' => $cancelledBill->id]);

            app(OperationalHealthScanService::class)->scan();

            expect(openAlert(OperationalHealthScanService::BILLS_WITHOUT_CHARGE)->payload['count'])->toBe(1);
        });

        it('does not reopen a scan alert that someone chose to ignore', function () {
            app(OperationalHealthScanService::class)->scan();
            OperationalAlert::query()->where('type', OperationalHealthScanService::PROVIDER_MISSING)->update(['status' => 'ignored']);

            app(OperationalHealthScanService::class)->scan();

            expect(OperationalAlert::query()->where('type', OperationalHealthScanService::PROVIDER_MISSING)->value('status')->value)->toBe('ignored');
        });
    });

    it('hides billing-system alerts from consultores but shows their own financial ones', function () {
        app(OperationalHealthScanService::class)->scan();
        CustomerCharge::factory()->create(['client_profile_id' => $this->client->id, 'status' => 'draft', 'created_at' => now()->subDays(3)]);
        app(OperationalHealthScanService::class)->scan();

        $visible = OperationalAlert::query()->visibleTo($this->consultor)->pluck('type');

        expect($visible)->toContain(OperationalHealthScanService::CHARGES_DRAFT_PENDING)
            ->and($visible)->not->toContain(OperationalHealthScanService::PROVIDER_MISSING);
    });
});
