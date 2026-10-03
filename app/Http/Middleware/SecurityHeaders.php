<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Sem CSP de propósito: o Inertia/Vite e os PDFs dependem de estilos inline, e uma
// política mal calibrada quebraria telas. Estes cabeçalhos não têm esse risco.
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN', false);
        $response->headers->set('X-Content-Type-Options', 'nosniff', false);
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin', false);
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()', false);

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains', false);
        }

        return $response;
    }
}
