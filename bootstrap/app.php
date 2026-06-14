<?php

use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectUserByRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        // O Roundcube precisa receber seu próprio ID de sessão e o token de
        // "session auth" sem alterações; se o Laravel criptografar esses
        // cookies, o Roundcube não consegue validar a sessão e exibe
        // "sessão inválida ou expirada" mesmo com o sessid correto.
        $middleware->encryptCookies(except: [
            'roundcube_sessid',
            'roundcube_sessauth',
        ]);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
            'redirect.role' => RedirectUserByRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
