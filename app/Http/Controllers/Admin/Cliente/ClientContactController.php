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
        $this->ensureInPortfolio($user);

        return Inertia::render('Consultor/Cliente/Contact/Edit/Page', [
            'user' => $user->load(['contatos']),
        ]);
    }

    public function update(StoreClientContactRequest $request, User $user)
    {
        $this->ensureInPortfolio($user);

        UserContact::updateOrCreate(
            ['user_id' => $user->id],
            $request->validated()
        );

        return redirect()
            ->back()
            ->with('success', 'Contatos atualizados com sucesso.');
    }

    // Sem isso qualquer consultor editava o contato de qualquer usuário pelo ID.
    private function ensureInPortfolio(User $user): void
    {
        abort_unless(User::query()->somenteMeusClientes()->whereKey($user->id)->exists(), 403);
    }
}
