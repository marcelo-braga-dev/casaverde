<?php

namespace App\Http\Controllers\Admin\Integracao;

use App\Http\Controllers\Controller;
use App\Models\Importacao\ImportEmailAccount;
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

        return Inertia::render('Admin/Integracao/Page', [
            'settings' => [
                'imap_default_host'       => $settings->get('imap_default_host',       ''),
                'imap_default_port'       => $settings->get('imap_default_port',       993),
                'imap_default_encryption' => $settings->get('imap_default_encryption', 'ssl'),
            ],
            'emails'   => $emails,
            'stats'    => [
                'total'       => $emails->count(),
                'available'   => $emails->whereNull('client_profile_id')->where('is_active', true)->count(),
                'assigned'    => $emails->whereNotNull('client_profile_id')->count(),
                'inactive'    => $emails->where('is_active', false)->count(),
            ],
        ]);
    }

    public function updateSettings(Request $request, SystemSettingService $settings)
    {
        $data = $request->validate([
            'imap_default_host'       => ['required', 'string', 'max:255'],
            'imap_default_port'       => ['required', 'integer', 'min:1', 'max:65535'],
            'imap_default_encryption' => ['required', 'in:ssl,tls,none'],
        ], [
            'imap_default_host.required'       => 'O servidor IMAP é obrigatório.',
            'imap_default_port.required'       => 'A porta é obrigatória.',
            'imap_default_encryption.required' => 'A criptografia é obrigatória.',
        ]);

        $userId = auth()->id();
        $settings->set('imap_default_host',       $data['imap_default_host'],       'string',  $userId);
        $settings->set('imap_default_port',       $data['imap_default_port'],       'integer', $userId);
        $settings->set('imap_default_encryption', $data['imap_default_encryption'], 'string',  $userId);

        return back()->with('success', 'Configurações IMAP salvas com sucesso.');
    }
}
