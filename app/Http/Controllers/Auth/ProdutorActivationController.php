<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ProdutorActivateAccountRequest;
use App\Models\Produtor\ProducerAccessInvite;
use App\Services\Produtor\ActivateProducerAccountService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProdutorActivationController extends Controller
{
    public function show(string $token)
    {
        $invite = ProducerAccessInvite::query()
            ->with('producerProfile')
            ->where('token', $token)
            ->first();

        abort_unless($invite && $invite->canBeUsed(), 404);

        return Inertia::render('Auth/ProdutorActivation/Page', [
            'token' => $token,
            'invite' => [
                'email' => $invite->email,
                'producer_name' => $invite->producerProfile?->admin_nome,
                'usina_nome' => $invite->producerProfile?->usina_nome,
                'expires_at' => $invite->expires_at?->format('d/m/Y H:i'),
            ],
        ]);
    }

    public function store(
        ProdutorActivateAccountRequest $request,
        ActivateProducerAccountService $service
    ) {
        $result = $service->handle(
            $request->validated()['token'],
            $request->validated()['name'],
            $request->validated()['password'],
        );

        Auth::login($result['user']);

        return redirect()->route('produtor.dashboard');
    }
}