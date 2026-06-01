<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Importacao\ImportEmailAccount;
use App\Models\Usina\Concessionaria;
use App\Services\Config\SystemSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientEmailImportSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Fatura/ImportSetting/Index/Page', [
            'settings' => ClientEmailImportSetting::query()
                ->with(['clientProfile', 'concessionaria', 'emailAccount'])
                ->orderByDesc('id')
                ->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Fatura/ImportSetting/Create/Page', [
            'clients'         => ClientProfile::query()->orderByDesc('id')
                ->get(['id', 'client_code', 'nome', 'razao_social', 'cpf', 'cnpj']),
            'concessionarias' => Concessionaria::query()->where('status', 'ativo')
                ->orderBy('nome')->get(['id', 'nome']),
        ]);
    }

    /**
     * Chamado a partir da aba Integração no Show do cliente (consultor.user.cliente.email-import-setting.store).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'client_profile_id'       => ['required', 'integer', 'exists:client_profiles,id'],
            'import_email_account_id' => ['nullable', 'integer', 'exists:import_email_accounts,id'],
            'concessionaria_id'       => ['nullable', 'integer', 'exists:concessionarias,id'],
            'pdf_password'            => ['nullable', 'string', 'max:255'],
            'sender_filter'           => ['nullable', 'string', 'max:255'],
            'subject_filter'          => ['nullable', 'string', 'max:255'],
            'is_active'               => ['required', 'boolean'],
        ]);

        $svc       = app(SystemSettingService::class);
        $clientId  = $data['client_profile_id'];
        $accountId = $data['import_email_account_id'] ?? null;

        // Busca a conta de email do pool (para obter o email e preencher imap_email)
        $emailAccount = $accountId
            ? ImportEmailAccount::find($accountId)
            : null;

        // Vincula email do pool ao cliente
        if ($emailAccount) {
            $emailAccount->update(['client_profile_id' => $clientId, 'assigned_at' => now()]);
        }

        $upsert = [
            'import_email_account_id' => $accountId,
            'concessionaria_id'       => $data['concessionaria_id'] ?? null,
            'is_active'               => (bool) $data['is_active'],
            'user_id'                 => auth()->id(),
            'imap_host'               => $svc->get('imap_default_host',       'mail.casaverde.com.br'),
            'imap_port'               => $svc->get('imap_default_port',       993),
            'imap_encryption'         => $svc->get('imap_default_encryption', 'ssl'),
            // imap_email e imap_password: preenchidos com os dados do pool (NOT NULL no banco legado)
            // O valor real em tempo de uso vem dos atributos effective_* do model
            'imap_email'              => $emailAccount?->email    ?? '',
            'imap_password'           => $emailAccount?->imap_password ?? '',
            'sender_filter'           => $data['sender_filter']  ?? null,
            'subject_filter'          => $data['subject_filter'] ?? null,
        ];

        if (!empty($data['pdf_password'])) {
            $upsert['pdf_password'] = $data['pdf_password'];
        }

        ClientEmailImportSetting::updateOrCreate(
            ['client_profile_id' => $clientId],
            $upsert
        );

        return back()->with('success', 'Configuração de importação salva com sucesso.');
    }

    public function show(ClientEmailImportSetting $faturaImportSetting)
    {
        return Inertia::render('Admin/Fatura/ImportSetting/Show/Page', [
            'setting' => $faturaImportSetting->load(['clientProfile', 'concessionaria', 'emailAccount']),
        ]);
    }

    public function edit(ClientEmailImportSetting $faturaImportSetting)
    {
        return Inertia::render('Admin/Fatura/ImportSetting/Edit/Page', [
            'setting'         => $faturaImportSetting->load(['clientProfile', 'concessionaria', 'emailAccount']),
            'clients'         => ClientProfile::query()->orderByDesc('id')
                ->get(['id', 'client_code', 'nome', 'razao_social', 'cpf', 'cnpj']),
            'concessionarias' => Concessionaria::query()->where('status', 'ativo')
                ->orderBy('nome')->get(['id', 'nome']),
        ]);
    }

    public function update(Request $request, ClientEmailImportSetting $faturaImportSetting)
    {
        $data = $request->validate([
            'import_email_account_id' => ['nullable', 'integer', 'exists:import_email_accounts,id'],
            'concessionaria_id'       => ['nullable', 'integer', 'exists:concessionarias,id'],
            'pdf_password'            => ['nullable', 'string', 'max:255'],
            'sender_filter'           => ['nullable', 'string', 'max:255'],
            'subject_filter'          => ['nullable', 'string', 'max:255'],
            'is_active'               => ['boolean'],
        ]);

        $newAccountId = $data['import_email_account_id'] ?? null;
        $oldAccountId = $faturaImportSetting->import_email_account_id;

        $newEmailAccount = $newAccountId ? ImportEmailAccount::find($newAccountId) : null;

        // Gerencia vínculo no pool quando a conta de email muda
        if ($newAccountId !== $oldAccountId) {
            if ($oldAccountId) {
                ImportEmailAccount::where('id', $oldAccountId)
                    ->update(['client_profile_id' => null, 'assigned_at' => null]);
            }
            if ($newEmailAccount) {
                $newEmailAccount->update([
                    'client_profile_id' => $faturaImportSetting->client_profile_id,
                    'assigned_at'       => now(),
                ]);
            }
        }

        // Sincroniza imap_email e imap_password com os dados do pool (campos NOT NULL legados)
        if ($newEmailAccount) {
            $data['imap_email']    = $newEmailAccount->email;
            $data['imap_password'] = $newEmailAccount->imap_password ?? '';
        }

        if (empty($data['pdf_password'])) {
            unset($data['pdf_password']);
        }

        $faturaImportSetting->update($data);

        return back()->with('success', 'Configuração atualizada com sucesso.');
    }
}
