<?php

namespace App\Http\Controllers\Admin\Integracao;

use App\Http\Controllers\Controller;
use App\Models\Importacao\ImportEmailAccount;
use App\Services\Config\SystemSettingService;
use App\Services\Integracao\Cpanel\CpanelEmailService;
use App\Services\Integracao\Roundcube\RoundcubeAutoLoginService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Throwable;

class ImportEmailAccountController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:import_email_accounts,email'],
            'label' => ['nullable', 'string', 'max:120'],
            'imap_password' => ['nullable', 'string', 'max:255'],
            'webmail_url' => ['nullable', 'string', 'max:255'],
            'sender_filter' => ['nullable', 'string', 'max:255'],
            'subject_filter' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ], [
            'email.unique' => 'Este email já está cadastrado na plataforma.',
            'email.email' => 'Informe um endereço de email válido.',
        ]);

        $data['created_by_user_id'] = auth()->id();
        $data['is_active'] = $data['is_active'] ?? true;

        ImportEmailAccount::create($data);

        return back()->with('success', 'Email adicionado ao pool com sucesso.');
    }

    public function update(Request $request, ImportEmailAccount $account)
    {
        $data = $request->validate([
            'label' => ['nullable', 'string', 'max:120'],
            'imap_password' => ['nullable', 'string', 'max:255'],
            'webmail_url' => ['nullable', 'string', 'max:255'],
            'sender_filter' => ['nullable', 'string', 'max:255'],
            'subject_filter' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        // Preserva senha atual se não for informada
        if (empty($data['imap_password'])) {
            unset($data['imap_password']);
        }

        $account->update($data);

        return back()->with('success', 'Email atualizado com sucesso.');
    }

    /**
     * Cria a caixa de email diretamente no cPanel (Email::add_pop) e
     * adiciona a conta criada ao pool de emails da plataforma.
     */
    public function storeViaCpanel(Request $request, CpanelEmailService $cpanel)
    {
        $data = $request->validate([
            'domain' => ['required', 'string', 'max:255'],
            'local_part' => ['nullable', 'string', 'max:64', 'regex:/^[a-zA-Z0-9._-]+$/'],
            'password' => ['nullable', 'string', 'min:8', 'max:255'],
            'quota_mb' => ['nullable', 'integer', 'min:0'],
            'label' => ['nullable', 'string', 'max:120'],
            'webmail_url' => ['nullable', 'string', 'max:255'],
            'sender_filter' => ['nullable', 'string', 'max:255'],
            'subject_filter' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'local_part.regex' => 'O usuário do email deve conter apenas letras, números, pontos, hífens e underscores.',
        ]);

        $localPart = $data['local_part'] ?: 'fatura.'.Str::lower(Str::random(6));
        $password = $data['password'] ?: Str::password(16);
        $email = "{$localPart}@{$data['domain']}";

        if (ImportEmailAccount::where('email', $email)->exists()) {
            return back()->with('error', "O email {$email} já está cadastrado na plataforma.");
        }

        try {
            $cpanel->createEmailAccount($data['domain'], $localPart, $password, $data['quota_mb'] ?? 0);
        } catch (Throwable $e) {
            return back()->with('error', 'Falha ao criar a conta no cPanel: '.$e->getMessage());
        }

        ImportEmailAccount::create([
            'email' => $email,
            'label' => $data['label'] ?? null,
            'imap_password' => $password,
            'webmail_url' => $data['webmail_url'] ?? null,
            'sender_filter' => $data['sender_filter'] ?? null,
            'subject_filter' => $data['subject_filter'] ?? null,
            'notes' => $data['notes'] ?? null,
            'is_active' => true,
            'created_by_user_id' => auth()->id(),
        ]);

        return back()->with('success', "Conta de email {$email} criada com sucesso no cPanel e adicionada ao pool.");
    }

    /**
     * Realiza o login no Roundcube em nome do usuário (via HTTP, capturando
     * o token CSRF e o cookie de sessão) e redireciona o navegador já
     * autenticado para a caixa de entrada do webmail.
     */
    public function roundcube(ImportEmailAccount $account, RoundcubeAutoLoginService $roundcube, SystemSettingService $settings)
    {
        abort_unless($account->webmail_url, 404, 'Webmail não configurado para este email.');
        abort_unless($account->imap_password, 404, 'Senha do email não configurada.');

        try {
            $result = $roundcube->login($account->webmail_url, $account->email, $account->imap_password);
        } catch (Throwable $e) {
            return back()->with('error', 'Falha ao acessar o Roundcube: '.$e->getMessage());
        }

        $response = redirect()->away($result['redirectUrl']);
        $cookieDomain = $this->resolveSharedCookieDomain($result['redirectUrl'], $settings->get('cpanel_email_domain'));

        foreach ($result['cookies'] as $cookie) {
            $response->withCookie(cookie(
                name: $cookie['name'],
                value: $cookie['value'],
                minutes: 0,
                path: '/',
                domain: $cookieDomain,
                secure: request()->isSecure(),
                httpOnly: true,
                sameSite: 'lax',
            ));
        }

        return $response;
    }

    /**
     * Encontra um domínio "pai" comum entre o domínio configurado para os
     * emails (cPanel) e o host do webmail, permitindo que o cookie de
     * sessão do Roundcube seja repassado para o navegador no redirect
     * cross-subdomain (ex: app.dominio.com.br -> webmail.dominio.com.br).
     */
    private function resolveSharedCookieDomain(string $redirectUrl, ?string $apexDomain): ?string
    {
        if (! $apexDomain) {
            return null;
        }

        $host = parse_url($redirectUrl, PHP_URL_HOST);

        if ($host && ($host === $apexDomain || str_ends_with($host, ".{$apexDomain}"))) {
            return ".{$apexDomain}";
        }

        return null;
    }

    public function destroy(ImportEmailAccount $account)
    {
        if ($account->client_profile_id) {
            return back()->with('error', 'Não é possível excluir um email vinculado a um cliente. Desvincule primeiro.');
        }

        $account->delete();

        return back()->with('success', 'Email removido do pool.');
    }

    public function unassign(ImportEmailAccount $account)
    {
        $account->update([
            'client_profile_id' => null,
            'assigned_at' => null,
        ]);

        // Limpa o vínculo na configuração de importação do cliente
        if ($setting = $account->importSetting) {
            $setting->update(['import_email_account_id' => null]);
        }

        return back()->with('success', 'Email desvinculado do cliente.');
    }
}
