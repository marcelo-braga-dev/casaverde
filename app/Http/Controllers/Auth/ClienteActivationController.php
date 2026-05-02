<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ClienteActivateAccountRequest;
use App\Models\Cliente\ClientAccessInvite;
use App\Services\Cliente\ActivateClientAccountService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClienteActivationController extends Controller
{
    public function show(string $token)
    {
        $invite = ClientAccessInvite::query()
            ->with('clientProfile')
            ->where('token', $token)
            ->first();

        abort_unless($invite && $invite->canBeUsed(), 404);

        return Inertia::render('Auth/Cliente/ClienteActivation/Page', [
            'token' => $token,
            'invite' => [
                'email' => $invite->email,
                'client_name' => $invite->clientProfile->display_name,
                'expires_at' => $invite->expires_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    public function store(
        ClienteActivateAccountRequest $request,
        ActivateClientAccountService $service
    ) {
        $result = $service->handle(
            $request->validated()['token'],
            $request->validated()['name'],
            $request->validated()['password'],
        );

        Auth::login($result['user']);

        return redirect()->route('dashboard');
    }
}
