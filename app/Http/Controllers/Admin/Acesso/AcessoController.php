<?php

namespace App\Http\Controllers\Admin\Acesso;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Services\Acesso\GerenciarAcessoService;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class AcessoController extends Controller
{
    public function __construct(private readonly GerenciarAcessoService $service) {}

    private function ensureAdmin(): void
    {
        abort_unless(auth()->user()?->isAdmin(), 403, 'Apenas administradores podem gerenciar acessos.');
    }

    // ── CLIENTE ────────────────────────────────────────────────────────────

    public function storeCliente(Request $request, ClientProfile $cliente)
    {
        $this->ensureAdmin();

        $existingUserId = $cliente->platform_user_id;

        $rules = [
            'name'     => ['required', 'string', 'min:2', 'max:120'],
            'email'    => ['required', 'email', "unique:users,email,{$existingUserId}"],
            'password' => $existingUserId
                ? ['nullable', Password::min(6)->letters()->numbers()]
                : ['required', Password::min(6)->letters()->numbers()],
        ];

        $data = $request->validate($rules, [
            'email.unique'     => 'Este e-mail já está em uso por outro usuário.',
            'password.required'=> 'A senha é obrigatória ao criar o acesso.',
        ]);

        $user = $this->service->criarOuAtualizar(
            name:            $data['name'],
            email:           $data['email'],
            password:        $data['password'] ?? '',
            roleId:          RoleUser::$CLIENTE,
            vincularAoPerfil: fn ($uid) => $cliente->update(['platform_user_id' => $uid]),
            existingUserId:  $existingUserId,
        );

        return back()->with('success', $existingUserId
            ? 'Credenciais do cliente atualizadas.'
            : "Acesso criado com sucesso. O cliente pode entrar com {$data['email']}."
        );
    }

    // ── PRODUTOR ───────────────────────────────────────────────────────────

    public function storeProdutor(Request $request, ProducerProfile $produtor)
    {
        $this->ensureAdmin();

        $existingUserId = $produtor->platform_user_id;

        $data = $request->validate([
            'name'     => ['required', 'string', 'min:2', 'max:120'],
            'email'    => ['required', 'email', "unique:users,email,{$existingUserId}"],
            'password' => $existingUserId
                ? ['nullable', Password::min(6)->letters()->numbers()]
                : ['required', Password::min(6)->letters()->numbers()],
        ]);

        $user = $this->service->criarOuAtualizar(
            name:            $data['name'],
            email:           $data['email'],
            password:        $data['password'] ?? '',
            roleId:          RoleUser::$PRODUTOR,
            vincularAoPerfil: fn ($uid) => $produtor->update(['platform_user_id' => $uid]),
            existingUserId:  $existingUserId,
        );

        return back()->with('success', $existingUserId
            ? 'Credenciais do produtor atualizadas.'
            : "Acesso criado. O produtor pode entrar com {$data['email']}."
        );
    }

    // ── BLOQUEAR / LIBERAR ────────────────────────────────────────────────

    public function bloquear(Request $request, User $user)
    {
        $this->ensureAdmin();

        $data = $request->validate([
            'notes' => ['nullable', 'string', 'max:300'],
        ]);

        $this->service->bloquear($user, $data['notes'] ?? '');

        return back()->with('success', "Acesso de {$user->name} bloqueado.");
    }

    public function liberar(Request $request, User $user)
    {
        $this->ensureAdmin();

        $data = $request->validate([
            'notes' => ['nullable', 'string', 'max:300'],
        ]);

        $this->service->liberar($user, $data['notes'] ?? '');

        return back()->with('success', "Acesso de {$user->name} liberado.");
    }
}
