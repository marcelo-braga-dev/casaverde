<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use Inertia\Testing\AssertableInertia as Assert;

describe('Payment slip access for consultores', function () {

    beforeEach(function () {
        $this->consultor = User::factory()->consultor()->create();
        $otherConsultor = User::factory()->consultor()->create();

        $this->ownSlip = PaymentSlip::factory()->create([
            'customer_charge_id' => CustomerCharge::factory()->create([
                'client_profile_id' => ClientProfile::factory()->create(['consultor_user_id' => $this->consultor->id])->id,
            ])->id,
        ]);

        $this->foreignCharge = CustomerCharge::factory()->create([
            'status' => 'open',
            'client_profile_id' => ClientProfile::factory()->create(['consultor_user_id' => $otherConsultor->id])->id,
        ]);
        $this->foreignSlip = PaymentSlip::factory()->create(['customer_charge_id' => $this->foreignCharge->id]);

        $this->actingAs($this->consultor);
    });

    it('lists only payments of the consultor own clients', function () {
        $this->get(route('admin.financeiro.pagamentos.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('payments.data', 1)
                ->where('payments.data.0.id', $this->ownSlip->id));
    });

    it('lists only charges of the consultor own clients', function () {
        $this->get(route('admin.financeiro.cobrancas.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('charges.data', 1)
                ->where('charges.data.0.id', $this->ownSlip->customer_charge_id));
    });

    it('can open a payment of its own client', function () {
        $this->get(route('admin.financeiro.pagamentos.show', $this->ownSlip))->assertOk();
    });

    it('cannot see, sync, cancel or generate payments of another consultor client', function () {
        $this->get(route('admin.financeiro.pagamentos.show', $this->foreignSlip))->assertForbidden();
        $this->post(route('admin.financeiro.pagamentos.sync', $this->foreignSlip))->assertForbidden();
        $this->post(route('admin.financeiro.pagamentos.cancel', $this->foreignSlip))->assertForbidden();
        $this->post(route('admin.financeiro.pagamentos.generate-from-charge', $this->foreignCharge))->assertForbidden();
        $this->post(route('admin.financeiro.cobrancas.cancel', $this->foreignCharge))->assertForbidden();
        $this->post(route('admin.financeiro.cobrancas.mark-paid', $this->foreignCharge))->assertForbidden();
    });

    it('cannot access payment webhooks', function () {
        $this->get(route('admin.financeiro.payment-webhooks.index'))->assertForbidden();
    });
});
