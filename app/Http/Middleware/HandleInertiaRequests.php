<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'nome' => $user->nome,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'role_name' => $user->role_name,
                    'consultor_id' => $user->consultor_id,
                    'status' => $user->status,
                    'status_nome' => $user->status_nome,
                    'dados_acesso' => $user->dados_acesso,
                ] : null,
            ],
            'alert' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
