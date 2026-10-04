<?php

namespace App\Services\Demo;

use App\Models\Demo\DemoVisitor;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use InvalidArgumentException;

class DemoAccessService
{
    public const SESSION_VISITOR = 'demo_visitor_id';

    public const SESSION_ROLE = 'demo_role';

    public const ROLES = [
        'admin' => 'Administrador',
        'consultor' => 'Consultor',
        'cliente' => 'Cliente',
        'produtor' => 'Produtor',
    ];

    public function enabled(): bool
    {
        return (bool) config('demo.enabled');
    }

    /** Registra o visitante ou, se já veio antes (mesmo e-mail ou telefone), soma a visita. */
    public function registerVisitor(array $data, Request $request): DemoVisitor
    {
        $email = isset($data['email']) ? mb_strtolower(trim($data['email'])) : null;
        $phone = isset($data['phone']) ? preg_replace('/\D/', '', $data['phone']) : null;

        $visitor = DemoVisitor::query()
            ->where(fn ($q) => $q
                ->when($email, fn ($q) => $q->orWhere('email', $email))
                ->when($phone, fn ($q) => $q->orWhere('phone', $phone)))
            ->first();

        $tracking = [
            'name' => trim($data['name']),
            'company' => $data['company'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 1000),
            'last_seen_at' => now(),
        ];

        if ($visitor) {
            $visitor->fill(array_filter($tracking + ['email' => $email, 'phone' => $phone]));
            $visitor->visits++;
            $visitor->save();

            return $visitor;
        }

        return DemoVisitor::create($tracking + [
            'email' => $email,
            'phone' => $phone,
            'referer' => mb_substr((string) $request->headers->get('referer'), 0, 255) ?: null,
            'utm_source' => $data['utm_source'] ?? null,
            'utm_medium' => $data['utm_medium'] ?? null,
            'utm_campaign' => $data['utm_campaign'] ?? null,
            'visits' => 1,
            'roles_viewed' => [],
            'first_seen_at' => now(),
        ]);
    }

    /** Entra (ou troca) para a conta de demonstração do perfil pedido. */
    public function enterAs(string $role, DemoVisitor $visitor, Request $request): User
    {
        $user = $this->userFor($role);

        Auth::login($user);
        $request->session()->put(self::SESSION_VISITOR, $visitor->id);
        $request->session()->put(self::SESSION_ROLE, $role);

        $visitor->update([
            'last_role' => $role,
            'roles_viewed' => array_values(array_unique([...($visitor->roles_viewed ?? []), $role])),
            'last_seen_at' => now(),
        ]);

        return $user;
    }

    public function userFor(string $role): User
    {
        if (! array_key_exists($role, self::ROLES)) {
            throw new InvalidArgumentException("Perfil de demonstração inválido: {$role}");
        }

        $roleId = RoleUser::idByName($role);
        $email = config("demo.users.{$role}");

        $user = User::query()->where('email', $email)->where('role_id', $roleId)->first()
            ?? User::query()->where('role_id', $roleId)->orderBy('id')->first();

        if (! $user) {
            throw new InvalidArgumentException("Nenhum usuário de demonstração com o perfil {$role}. Rode o MarketingDemoSeeder.");
        }

        return $user;
    }

    public function currentVisitor(Request $request): ?DemoVisitor
    {
        $id = $request->session()->get(self::SESSION_VISITOR);

        return $id ? DemoVisitor::find($id) : null;
    }

    public function trackPageView(Request $request): void
    {
        $id = $request->session()->get(self::SESSION_VISITOR);

        if ($id) {
            DemoVisitor::whereKey($id)->update([
                'page_views' => DB::raw('page_views + 1'),
                'last_seen_at' => now(),
            ]);
        }
    }

    /** Dados compartilhados com o frontend (barra de demonstração e bloqueio de ações). */
    public function sharedProps(Request $request): array
    {
        $allowedPosts = collect(config('demo.readonly_post_routes', []))
            ->filter(fn ($name) => Route::has($name))
            ->map(fn ($name) => parse_url(route($name), PHP_URL_PATH))
            ->values();

        return [
            'enabled' => true,
            'role' => $request->session()->get(self::SESSION_ROLE),
            'visitor' => $this->currentVisitor($request)?->only(['name']),
            'roles' => collect(self::ROLES)->map(fn ($label, $key) => ['key' => $key, 'label' => $label])->values(),
            'allowed_paths' => $allowedPosts->merge(['/demo/', '/logout'])->values(),
        ];
    }
}
