<?php

namespace App\Http\Middleware;

use App\src\Roles\RoleUser;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectUserByRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        if ($request->routeIs('dashboard')) {
            return match ((int) $user->role_id) {
                RoleUser::$ADMIN,
                RoleUser::$CONSULTOR => redirect()->route('admin.dashboard'),

                RoleUser::$CLIENTE => redirect()->route('cliente.dashboard'),

                RoleUser::$PRODUTOR => redirect()->route('produtor.dashboard'),

                default => $next($request),
            };
        }

        return $next($request);
    }
}