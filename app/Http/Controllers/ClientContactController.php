<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreClientContactRequest;
use App\Models\Users\User;
use App\Models\Users\UserContact;
use Inertia\Inertia;

class ClientContactController extends Controller
{
    public function edit(User $user)
    {
        return Inertia::render('Admin/Cliente/Contact/Edit/Page', [
            'user' => $user->load(['contatos']),
        ]);
    }

    public function update(StoreClientContactRequest $request, User $user)
    {
        UserContact::updateOrCreate(
            ['user_id' => $user->id],
            $request->validated()
        );

        return redirect()
            ->back()
            ->with('success', 'Contatos atualizados com sucesso.');
    }
}