<?php

namespace App\Http\Controllers\Admin\Integracao;

use App\Http\Controllers\Controller;
use App\Models\Importacao\ImportEmailAccount;
use Illuminate\Http\Request;

class ImportEmailAccountController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'email'          => ['required', 'email', 'max:255', 'unique:import_email_accounts,email'],
            'label'          => ['nullable', 'string', 'max:120'],
            'imap_password'  => ['nullable', 'string', 'max:255'],
            'sender_filter'  => ['nullable', 'string', 'max:255'],
            'subject_filter' => ['nullable', 'string', 'max:255'],
            'notes'          => ['nullable', 'string', 'max:500'],
            'is_active'      => ['boolean'],
        ], [
            'email.unique' => 'Este email já está cadastrado na plataforma.',
            'email.email'  => 'Informe um endereço de email válido.',
        ]);

        $data['created_by_user_id'] = auth()->id();
        $data['is_active']          = $data['is_active'] ?? true;

        ImportEmailAccount::create($data);

        return back()->with('success', 'Email adicionado ao pool com sucesso.');
    }

    public function update(Request $request, ImportEmailAccount $account)
    {
        $data = $request->validate([
            'label'          => ['nullable', 'string', 'max:120'],
            'imap_password'  => ['nullable', 'string', 'max:255'],
            'sender_filter'  => ['nullable', 'string', 'max:255'],
            'subject_filter' => ['nullable', 'string', 'max:255'],
            'notes'          => ['nullable', 'string', 'max:500'],
            'is_active'      => ['boolean'],
        ]);

        // Preserva senha atual se não for informada
        if (empty($data['imap_password'])) {
            unset($data['imap_password']);
        }

        $account->update($data);

        return back()->with('success', 'Email atualizado com sucesso.');
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
            'assigned_at'       => null,
        ]);

        // Limpa o vínculo na configuração de importação do cliente
        if ($setting = $account->importSetting) {
            $setting->update(['import_email_account_id' => null]);
        }

        return back()->with('success', 'Email desvinculado do cliente.');
    }
}
