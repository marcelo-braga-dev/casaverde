<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Users\User;

describe('Consultor não tem mais acesso a faturas de concessionária', function () {

    beforeEach(function () {
        $this->consultor = User::factory()->consultor()->create();
        $this->admin = User::factory()->admin()->create();
        $this->client = ClientProfile::factory()->create();
        $this->bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $this->client->id,
        ]);
    });

    it('blocks consultor from the manual bill upload page', function () {
        $this->actingAs($this->consultor)
            ->get(route('consultor.cliente.faturas.create'))
            ->assertForbidden();

        $this->actingAs($this->admin)
            ->get(route('consultor.cliente.faturas.create'))
            ->assertOk();
    });

    it('blocks consultor from viewing an existing bill', function () {
        $this->actingAs($this->consultor)
            ->get(route('consultor.cliente.faturas.show', $this->bill->id))
            ->assertForbidden();

        $this->actingAs($this->admin)
            ->get(route('consultor.cliente.faturas.show', $this->bill->id))
            ->assertOk();
    });

    it('blocks consultor from the bill report', function () {
        $this->actingAs($this->consultor)
            ->get(route('admin.relatorios.faturas'))
            ->assertForbidden();
    });

    it('blocks consultor from import settings and import history', function () {
        $this->actingAs($this->consultor)
            ->get(route('admin.fatura-import-settings.index'))
            ->assertForbidden();

        $this->actingAs($this->consultor)
            ->get(route('admin.import-history.index'))
            ->assertForbidden();
    });

    it('blocks consultor from saving the per-client pdf import password', function () {
        $this->actingAs($this->consultor)
            ->post(route('consultor.user.cliente.email-import-setting.store'), [
                'client_profile_id' => $this->client->id,
                'is_active' => true,
            ])
            ->assertForbidden();
    });

    it('blocks consultor from generating a charge from a bill', function () {
        $this->actingAs($this->consultor)
            ->post(route('admin.financeiro.cobrancas.generate-from-bill', $this->bill->id))
            ->assertForbidden();
    });

    it('does not expose bills.pending_review on the consultor dashboard anymore', function () {
        $response = $this->actingAs($this->consultor)->get(route('consultor.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->missing('summary.bills_pending_review'));
    });

});
