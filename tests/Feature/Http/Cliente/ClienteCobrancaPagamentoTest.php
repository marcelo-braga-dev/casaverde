<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use Carbon\CarbonImmutable;
use Inertia\Testing\AssertableInertia as Assert;

function clienteBoletoBarcode(int $daysFromToday): string
{
    $factor = 1000 + (int) CarbonImmutable::parse('2025-02-22')->diffInDays(today()->addDays($daysFromToday), false);

    return '34191'.$factor.str_repeat('1', 35);
}

describe('Pagamento da cobrança no portal do cliente', function () {

    beforeEach(function () {
        $this->cliente = User::factory()->cliente()->create();
        $profile = ClientProfile::factory()->create(['platform_user_id' => $this->cliente->id]);

        $this->charge = CustomerCharge::factory()->create([
            'client_profile_id' => $profile->id,
            'status' => 'waiting_payment',
        ]);

        $this->slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $this->charge->id,
            'payment_method' => 'boleto',
            'status' => 'pending',
            'barcode' => clienteBoletoBarcode(10),
            'digitable_line' => str_repeat('1', 47),
            'pix_copy_paste' => '00020126pix-copia-e-cola',
            'response_payload' => ['segredo' => 'resposta-bruta-do-provider'],
            'error_message' => 'erro interno',
        ]);

        $this->actingAs($this->cliente);
    });

    it('shows only the payment data of the active slip', function () {
        $this->get(route('cliente.cobrancas.show', $this->charge))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('pagamento.id', $this->slip->id)
                ->where('pagamento.digitable_line', str_repeat('1', 47))
                ->where('pagamento.pix_copy_paste', '00020126pix-copia-e-cola')
                ->where('pagamento.pdf_url', route('cliente.cobrancas.boleto.pdf', [$this->charge, $this->slip]))
                ->missing('pagamento.response_payload')
                ->missing('pagamento.error_message')
                ->missing('cobranca.payment_slips'));
    });

    it('does not offer a slip that is past the bank due date', function () {
        $this->slip->update(['barcode' => clienteBoletoBarcode(-1)]);

        $this->get(route('cliente.cobrancas.show', $this->charge))
            ->assertInertia(fn (Assert $page) => $page->where('pagamento', null));
    });

    it('does not offer payment for a paid charge', function () {
        $this->charge->update(['status' => 'paid']);

        $this->get(route('cliente.cobrancas.show', $this->charge))
            ->assertInertia(fn (Assert $page) => $page->where('pagamento', null));
    });

    it('streams the boleto pdf of its own charge', function () {
        $response = $this->get(route('cliente.cobrancas.boleto.pdf', [$this->charge, $this->slip]));

        $response->assertOk();
        expect($response->headers->get('content-type'))->toContain('application/pdf');
    });

    it('cannot download the boleto of another client', function () {
        $foreignCharge = CustomerCharge::factory()->create();
        $foreignSlip = PaymentSlip::factory()->create([
            'customer_charge_id' => $foreignCharge->id,
            'barcode' => clienteBoletoBarcode(10),
            'digitable_line' => str_repeat('1', 47),
        ]);

        $this->get(route('cliente.cobrancas.boleto.pdf', [$foreignCharge, $foreignSlip]))->assertForbidden();
        $this->get(route('cliente.cobrancas.boleto.pdf', [$this->charge, $foreignSlip]))->assertNotFound();
    });
});
