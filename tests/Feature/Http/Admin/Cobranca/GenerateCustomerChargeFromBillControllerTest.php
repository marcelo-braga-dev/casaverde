<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Users\User;

describe('GenerateCustomerChargeFromBillController', function () {

    beforeEach(function () {
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('creates the charge and redirects to the charge show page', function () {
        $client = ClientProfile::factory()->create();
        $bill = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $client->id,
            'valor_total' => 200.00,
        ]);

        $response = $this->post(route('admin.financeiro.cobrancas.generate-from-bill', $bill->id));

        $charge = CustomerCharge::query()->where('concessionaire_bill_id', $bill->id)->first();

        expect($charge)->not->toBeNull();

        $response->assertRedirect(route('admin.financeiro.cobrancas.show', $charge->id));
        $response->assertSessionHas('success');
    });

    it('redirects back with an error when the bill is not approved', function () {
        $client = ClientProfile::factory()->create();
        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'review_status' => 'pending_review',
        ]);

        $response = $this->post(route('admin.financeiro.cobrancas.generate-from-bill', $bill->id));

        $response->assertSessionHas('error');
        expect(CustomerCharge::query()->where('concessionaire_bill_id', $bill->id)->exists())->toBeFalse();
    });

});
