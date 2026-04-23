<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreClientContractDataRequest;
use App\Models\Users\User;
use App\Models\Users\UserData;
use Inertia\Inertia;

class ClientContractDataController extends Controller
{
    public function edit(User $user)
    {
        return Inertia::render('Admin/Cliente/ContractData/Edit/Page', [
            'user' => $user->load(['userData']),
        ]);
    }

    public function update(StoreClientContractDataRequest $request, User $user)
    {
        UserData::updateOrCreate(
            ['user_id' => $user->id],
            $request->validated()
        );

        return redirect()
            ->back()
            ->with('success', 'Dados contratuais atualizados com sucesso.');
    }
}