<?php

namespace App\Http\Controllers\Admin\Integracao;

use App\Http\Controllers\Controller;
use App\Models\Importacao\ImportEmailAccount;
use App\Models\Importacao\InstitutionalEmailAccount;
use App\Services\Config\SystemSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IntegracaoController extends Controller
{
    public function index(SystemSettingService $settings)
    {
        $emails = ImportEmailAccount::query()
            ->with(['clientProfile', 'createdBy'])
            ->orderBy('email')
            ->get();

        $institutionalEmails = InstitutionalEmailAccount::query()
            ->orderBy('email')
            ->get();

        return Inertia::render('Admin/Integracao/Page', [
            'settings' => [
                'imap_default_host' => $settings->get('imap_default_host', ''),
                'imap_default_port' => $settings->get('imap_default_port', 993),
                'imap_default_encryption' => $settings->get('imap_default_encryption', 'ssl'),
                'cpanel_host' => $settings->get('cpanel_host', ''),
                'cpanel_port' => $settings->get('cpanel_port', 2083),
                'cpanel_username' => $settings->get('cpanel_username', ''),
                'cpanel_email_domain' => $settings->get('cpanel_email_domain', ''),
                'cpanel_default_quota_mb' => $settings->get('cpanel_default_quota_mb', 0),
                'cpanel_webmail_domain' => $settings->get('cpanel_webmail_domain', ''),
                'cpanel_token_configured' => $settings->get('cpanel_api_token') !== null,
            ],
            'emails' => $emails,
            'institutionalEmails' => $institutionalEmails,
            'stats' => [
                'total' => $emails->count(),
                'available' => $emails->whereNull('client_profile_id')->where('is_active', true)->count(),
                'assigned' => $emails->whereNotNull('client_profile_id')->count(),
                'inactive' => $emails->where('is_active', false)->count(),
            ],
        ]);
    }

    public function updateSettings(Request $request, SystemSettingService $settings)
    {
        $data = $request->validate([
            'imap_default_host' => ['required', 'string', 'max:255'],
            'imap_default_port' => ['required', 'integer', 'min:1', 'max:65535'],
            'imap_default_encryption' => ['required', 'in:ssl,tls,none'],
        ], [
            'imap_default_host.required' => 'O servidor IMAP é obrigatório.',
            'imap_default_port.required' => 'A porta é obrigatória.',
            'imap_default_encryption.required' => 'A criptografia é obrigatória.',
        ]);

        $userId = auth()->id();
        $settings->set('imap_default_host', $data['imap_default_host'], 'string', $userId);
        $settings->set('imap_default_port', $data['imap_default_port'], 'integer', $userId);
        $settings->set('imap_default_encryption', $data['imap_default_encryption'], 'string', $userId);

        return back()->with('success', 'Configurações IMAP salvas com sucesso.');
    }

    public function updateCpanelSettings(Request $request, SystemSettingService $settings)
    {
        $data = $request->validate([
            'cpanel_host' => ['required', 'string', 'max:255'],
            'cpanel_port' => ['required', 'integer', 'min:1', 'max:65535'],
            'cpanel_username' => ['required', 'string', 'max:255'],
            'cpanel_email_domain' => ['required', 'string', 'max:255'],
            'cpanel_default_quota_mb' => ['nullable', 'integer', 'min:0'],
            'cpanel_webmail_domain' => ['nullable', 'string', 'max:255'],
            'cpanel_api_token' => ['nullable', 'string', 'max:1000'],
        ], [
            'cpanel_host.required' => 'O endereço do servidor cPanel é obrigatório.',
            'cpanel_username.required' => 'O usuário do cPanel é obrigatório.',
            'cpanel_email_domain.required' => 'O domínio de email é obrigatório.',
        ]);

        $userId = auth()->id();
        $settings->set('cpanel_host', $data['cpanel_host'], 'string', $userId);
        $settings->set('cpanel_port', $data['cpanel_port'], 'integer', $userId);
        $settings->set('cpanel_username', $data['cpanel_username'], 'string', $userId);
        $settings->set('cpanel_email_domain', $data['cpanel_email_domain'], 'string', $userId);
        $settings->set('cpanel_default_quota_mb', $data['cpanel_default_quota_mb'] ?? 0, 'integer', $userId);
        $settings->set('cpanel_webmail_domain', $data['cpanel_webmail_domain'] ?? '', 'string', $userId);

        // Preserva o token atual se nenhum novo valor for informado
        if (! empty($data['cpanel_api_token'])) {
            $settings->set('cpanel_api_token', $data['cpanel_api_token'], 'encrypted', $userId);
        }

        return back()->with('success', 'Configurações do cPanel salvas com sucesso.');
    }
}
