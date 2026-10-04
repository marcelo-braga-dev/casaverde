<?php

namespace App\Http\Middleware;

use App\Services\Demo\DemoAccessService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Modo demonstração (config/demo.php): a instância fica somente leitura. Esta é a
 * garantia real; o frontend apenas esmaece os botões e avisa o visitante.
 */
class DemoMode
{
    public const BLOCKED_MESSAGE = 'Acesso de teste: criar, editar e excluir estão desativados nesta demonstração.';

    // Fluxos de senha não existem na demonstração: o acesso é por nome + contato.
    private const PASSWORD_ROUTES = [
        'password.request', 'password.email', 'password.reset', 'password.store',
        'password.confirm', 'verification.notice', 'verification.send',
    ];

    public function __construct(private readonly DemoAccessService $demo) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->demo->enabled()) {
            return $next($request);
        }

        $route = (string) $request->route()?->getName();

        if (in_array($route, self::PASSWORD_ROUTES, true)) {
            return redirect()->route('login');
        }

        if (! $request->isMethodSafe() && ! $this->writeAllowed($route)) {
            return $this->deny($request);
        }

        // Telas de cadastro e edição só existem para alterar dados.
        if ($request->isMethodSafe() && preg_match('/\.(create|edit)$/', $route)) {
            return $this->deny($request);
        }

        $response = $next($request);

        if ($request->isMethod('GET') && $this->isPageView($request, $response)) {
            $this->demo->trackPageView($request);
        }

        return $response;
    }

    private function writeAllowed(string $route): bool
    {
        return $route === 'logout'
            || Str::startsWith($route, 'demo.')
            || in_array($route, config('demo.readonly_post_routes', []), true);
    }

    private function deny(Request $request): Response
    {
        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return response()->json(['message' => self::BLOCKED_MESSAGE, 'demo' => true], 403);
        }

        return redirect()->back(fallback: route('dashboard'))->with('warning', self::BLOCKED_MESSAGE);
    }

    private function isPageView(Request $request, Response $response): bool
    {
        return $response->getStatusCode() === 200
            && ($request->header('X-Inertia') || str_contains((string) $response->headers->get('Content-Type'), 'text/html'));
    }
}
