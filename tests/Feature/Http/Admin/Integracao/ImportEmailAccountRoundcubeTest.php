<?php

use App\Models\Importacao\ImportEmailAccount;
use App\Models\Users\User;
use App\Services\Config\SystemSettingService;
use Illuminate\Support\Facades\Http;

describe('Roundcube auto-login', function () {

    it('logs in to roundcube and redirects to the inbox with the session cookie forwarded', function () {
        $admin = User::factory()->admin()->create();

        app(SystemSettingService::class)->set('cpanel_email_domain', 'example.com.br', 'string', $admin->id);

        $account = ImportEmailAccount::create([
            'email' => 'fatura@example.com.br',
            'imap_password' => 'super-secret',
            'webmail_url' => 'https://webmail.example.com.br',
            'is_active' => true,
        ]);

        Http::fake(function ($request) {
            if ($request->method() === 'GET') {
                return Http::response('<input type="hidden" name="_token" value="csrf-token-123" />', 200);
            }

            return Http::response('', 302, [
                'Location' => 'https://webmail.example.com.br/?_task=mail',
                'Set-Cookie' => [
                    'roundcube_sessid=session-abc; Path=/; HttpOnly',
                    'roundcube_sessauth=auth-xyz; Path=/; HttpOnly',
                ],
            ]);
        });

        $response = $this->actingAs($admin)
            ->get(route('admin.integracao.emails.roundcube', $account));

        $response->assertRedirect('https://webmail.example.com.br/?_task=mail');
        $response->assertCookie('roundcube_sessid', 'session-abc', false);
        $response->assertCookie('roundcube_sessauth', 'auth-xyz', false);

        $cookies = collect($response->headers->getCookies());

        expect($cookies->first(fn ($cookie) => $cookie->getName() === 'roundcube_sessid')->getDomain())->toBe('.example.com.br');
        expect($cookies->first(fn ($cookie) => $cookie->getName() === 'roundcube_sessauth')->getDomain())->toBe('.example.com.br');

        Http::assertSent(fn ($request) => $request->method() === 'POST'
            && str_contains((string) $request->url(), 'webmail.example.com.br')
            && $request['_user'] === 'fatura@example.com.br'
            && $request['_pass'] === 'super-secret'
            && $request['_token'] === 'csrf-token-123');
    });

    it('shows an error when roundcube rejects the credentials', function () {
        $admin = User::factory()->admin()->create();

        $account = ImportEmailAccount::create([
            'email' => 'fatura@example.com.br',
            'imap_password' => 'wrong-password',
            'webmail_url' => 'https://webmail.example.com.br',
            'is_active' => true,
        ]);

        Http::fake(function ($request) {
            if ($request->method() === 'GET') {
                return Http::response('<input type="hidden" name="_token" value="csrf-token-123" />', 200);
            }

            return Http::response('<form id="login-form">...</form>', 200);
        });

        $response = $this->actingAs($admin)
            ->get(route('admin.integracao.emails.roundcube', $account));

        $response->assertRedirect();
        $response->assertSessionHas('error');
    });

    it('returns 404 when the account has no webmail url configured', function () {
        $admin = User::factory()->admin()->create();

        $account = ImportEmailAccount::create([
            'email' => 'fatura@example.com.br',
            'imap_password' => 'super-secret',
            'webmail_url' => null,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.integracao.emails.roundcube', $account))
            ->assertNotFound();
    });
});
