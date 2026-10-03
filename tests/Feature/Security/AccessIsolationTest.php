<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Services\Pagamento\PaymentSlipExpiredAlertService;

describe('Access isolation between roles and portfolios', function () {

    beforeEach(function () {
        $this->consultor = User::factory()->consultor()->create();
        $this->otherConsultor = User::factory()->consultor()->create();
        $this->foreignClient = ClientProfile::factory()->create(['consultor_user_id' => $this->otherConsultor->id]);
    });

    it('keeps clientes and produtores out of the legacy registry module but not out of profile/support', function (string $role) {
        $user = User::factory()->{$role}()->create();

        $this->actingAs($user)->getJson(route('auth.cliente.proposta.api.get'))->assertForbidden();
        $this->actingAs($user)->get(route('auth.perfil.usuario.index'))->assertOk();
        $this->actingAs($user)->get(route('support.tickets.index'))->assertOk();
    })->with(['cliente', 'produtor']);

    it('keeps consultores out of the legacy registry module, which has no portfolio filter', function () {
        $this->actingAs($this->consultor)->getJson(route('auth.cliente.proposta.api.get'))->assertForbidden();
    });

    it('keeps consultores out of company-wide admin areas', function (string $routeName) {
        $this->actingAs($this->consultor)->get(route($routeName))->assertForbidden();
    })->with([
        'admin.dashboard',
        'admin.settings.index',
        'admin.admin.config.geral.index',
        'admin.relatorios.financeiro',
        'admin.relatorios.executivo',
        'admin.relatorios.cobrancas',
        'admin.relatorios.pagamentos',
    ]);

    it('lets consultores reach their own allowed admin modules', function (string $routeName) {
        $this->actingAs($this->consultor)->get(route($routeName))->assertOk();
    })->with([
        'admin.financeiro.cobrancas.index',
        'admin.financeiro.pagamentos.index',
        'admin.operational-alerts.index',
        'admin.relatorios.clientes',
        'admin.relatorios.usinas',
    ]);

    it('forbids a consultor from changing a client of another portfolio', function () {
        $this->actingAs($this->consultor);

        $this->put(route('consultor.user.cliente.identidade.update', $this->foreignClient), ['nome' => 'Invasor'])->assertForbidden();
        $this->put(route('consultor.user.cliente.update', $this->foreignClient), ['nome' => 'Invasor'])->assertForbidden();
        $this->delete(route('consultor.user.cliente.destroy', $this->foreignClient))->assertForbidden();

        expect($this->foreignClient->fresh()->nome)->not->toBe('Invasor')
            ->and($this->foreignClient->fresh()->trashed())->toBeFalse();
    });

    it('forbids a consultor from changing a producer of another portfolio', function () {
        $producer = ProducerProfile::factory()->create(['consultor_user_id' => $this->otherConsultor->id]);

        $this->actingAs($this->consultor)
            ->put(route('consultor.producer.profiles.identidade.update', $producer), ['nome' => 'Invasor'])
            ->assertForbidden();
    });

    it('forbids a consultor from acting on charges and alerts of another portfolio', function () {
        $charge = CustomerCharge::factory()->create(['client_profile_id' => $this->foreignClient->id, 'status' => 'draft']);
        app(PaymentSlipExpiredAlertService::class)->notify($charge);
        $alert = $charge->operationalAlerts()->first();

        $this->actingAs($this->consultor);

        $this->post(route('admin.financeiro.cobrancas.approve', $charge))->assertForbidden();
        $this->post(route('admin.financeiro.cobrancas.mark-overdue', $charge))->assertForbidden();
        $this->put(route('admin.operational-alerts.resolve', $alert))->assertForbidden();
        $this->put(route('admin.operational-alerts.ignore', $alert))->assertForbidden();

        expect($charge->fresh()->status)->toBe('draft');
    });
});

it('sends baseline security headers on web responses', function () {
    $this->get(route('login'))
        ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
});
