<?php

namespace App\Http\Controllers\Admin\Integracao;

use App\Http\Controllers\Controller;
use App\Http\Requests\Config\StoreInstitutionalEmailAccountRequest;
use App\Http\Requests\Config\UpdateInstitutionalEmailAccountRequest;
use App\Models\Importacao\InstitutionalEmailAccount;

class InstitutionalEmailAccountController extends Controller
{
    public function store(StoreInstitutionalEmailAccountRequest $request)
    {
        $data = $request->validated();
        $data['created_by_user_id'] = auth()->id();
        $data['is_active'] = $data['is_active'] ?? true;

        InstitutionalEmailAccount::create($data);

        return back()->with('success', 'Email institucional adicionado com sucesso.');
    }

    public function update(UpdateInstitutionalEmailAccountRequest $request, InstitutionalEmailAccount $institutionalEmail)
    {
        $data = $request->validated();

        // Preserva senha atual se não for informada
        if (empty($data['password'])) {
            unset($data['password']);
        }

        $institutionalEmail->update($data);

        return back()->with('success', 'Email institucional atualizado com sucesso.');
    }

    public function destroy(InstitutionalEmailAccount $institutionalEmail)
    {
        $institutionalEmail->delete();

        return back()->with('success', 'Email institucional removido com sucesso.');
    }
}
