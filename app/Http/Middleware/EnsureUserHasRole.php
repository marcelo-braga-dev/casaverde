<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Usuário não autenticado.');
        }

        if (!in_array($user->role_name, $roles, true)) {
            abort(403, 'Você não possui permissão para acessar este recurso.');
        }

        return $next($request);
    }
}