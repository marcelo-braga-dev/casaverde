<?php

use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Users\User;
use Inertia\Testing\AssertableInertia as Assert;

describe('PaymentProviderAccountController', function () {

    beforeEach(function () {
        $this->account = PaymentProviderAccount::factory()->create([
            'provider' => 'mercado_pago',
            'client_secret' => 'APP_USR-segredo-de-producao',
            'webhook_secret' => 'segredo-webhook',
        ]);
    });

    it('never sends the decrypted secrets to the frontend', function (string $routeName) {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route($routeName, $this->account))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->missing('account.client_secret')
                ->missing('account.webhook_secret'));
    })->with([
        'admin.financeiro.payment-provider-accounts.show',
        'admin.financeiro.payment-provider-accounts.edit',
    ]);

    it('forbids consultores from accessing provider accounts', function () {
        $this->actingAs(User::factory()->consultor()->create())
            ->get(route('admin.financeiro.payment-provider-accounts.show', $this->account))
            ->assertForbidden();
    });
});
