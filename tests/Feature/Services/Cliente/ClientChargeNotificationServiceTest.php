<?php

use App\Jobs\SendChargeReminderJob;
use App\Mail\Cliente\ChargePaymentMail;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Pagamento\GeneratePaymentSlipService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

describe('Notificação de cobrança ao cliente por e-mail', function () {

    beforeEach(function () {
        Mail::fake();

        $this->client = ClientProfile::factory()->create();
        $this->client->contacts->update(['email' => 'cliente@example.com']);

        $this->charge = CustomerCharge::factory()->create([
            'client_profile_id' => $this->client->id,
            'status' => 'open',
            'due_date' => now()->addDays(3)->toDateString(),
            'reminder_sent_at' => null,
        ]);
    });

    it('emails the client when a payment is generated', function () {
        mercadoPagoAccount();
        Http::fake(['mp.test/v1/orders' => Http::response(mpOrder('inv-1'), 201)]);

        $slip = app(GeneratePaymentSlipService::class)->handle($this->charge);

        Mail::assertQueued(ChargePaymentMail::class, fn (ChargePaymentMail $mail) => $mail->hasTo('cliente@example.com')
            && $mail->kind === ChargePaymentMail::AVAILABLE
            && $mail->slip->is($slip));
    });

    it('does not email when the provider rejects the payment', function () {
        mercadoPagoAccount();
        Http::fake(['mp.test/v1/orders' => Http::response(['message' => 'erro'], 400)]);

        try {
            app(GeneratePaymentSlipService::class)->handle($this->charge);
        } catch (Throwable) {
        }

        Mail::assertNothingQueued();
    });

    it('never emails the synthetic platform address', function () {
        $this->client->contacts->update(['email' => null]);
        $this->charge->update([
            'platform_user_id' => User::factory()->create(['email' => "cliente-{$this->client->id}@casaverde.local"])->id,
        ]);
        mercadoPagoAccount();
        Http::fake(['mp.test/v1/orders' => Http::response(mpOrder('inv-1'), 201)]);

        app(GeneratePaymentSlipService::class)->handle($this->charge);

        Mail::assertNothingQueued();
    });

    it('sends the upcoming due reminder with the payable slip', function () {
        PaymentSlip::factory()->create([
            'customer_charge_id' => $this->charge->id,
            'status' => 'pending',
            'pix_copy_paste' => 'pix',
        ]);

        dispatch_sync(new SendChargeReminderJob($this->charge->id, 'upcoming_due'));

        Mail::assertQueued(ChargePaymentMail::class, fn (ChargePaymentMail $mail) => $mail->kind === ChargePaymentMail::REMINDER);
    });

    it('does not send the reminder when there is no payable slip', function () {
        PaymentSlip::factory()->create(['customer_charge_id' => $this->charge->id, 'status' => 'expired']);

        dispatch_sync(new SendChargeReminderJob($this->charge->id, 'upcoming_due'));

        Mail::assertNothingQueued();
    });

    it('renders the email with the payment data and portal link', function () {
        $this->charge->update(['platform_user_id' => null]);
        $this->client->update(['platform_user_id' => User::factory()->cliente()->create()->id]);
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $this->charge->id,
            'status' => 'pending',
            'amount' => 321.45,
            'pix_copy_paste' => '00020126pix-copia-e-cola',
            'digitable_line' => '34191790010104351004791020150008291070026000',
        ]);

        $html = (new ChargePaymentMail($slip, ChargePaymentMail::AVAILABLE))->render();

        expect($html)->toContain('R$ 321,45')
            ->toContain('00020126pix-copia-e-cola')
            ->toContain('34191790010104351004791020150008291070026000')
            ->toContain(route('cliente.cobrancas.show', $this->charge));
    });
});
