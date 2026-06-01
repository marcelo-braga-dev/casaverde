<?php

namespace App\Http\Controllers\Admin\Usuarios\Admin;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Garante que apenas admins acessam este controller
    private function ensureAdmin(): void
    {
        abort_unless(auth()->user()?->isAdmin(), 403, 'Apenas administradores podem gerenciar outros administradores.');
    }

    public function index()
    {
        $this->ensureAdmin();

        $admins = User::query()
            ->where('role_id', RoleUser::$ADMIN)
            ->orderByDesc('id')
            ->paginate(15);

        return Inertia::render('Admin/User/Admin/Index/Page', [
            'admins' => $admins,
        ]);
    }

    public function create()
    {
        $this->ensureAdmin();

        return Inertia::render('Admin/User/Admin/Create/Page');
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = $request->validate([
            'name'     => ['required', 'string', 'min:2', 'max:120'],
            'email'    => ['required', 'email', 'max:200', 'unique:users,email'],
            'password' => ['required', Password::min(6)->letters()->numbers(), 'confirmed'],
            'status'   => ['required', 'string'],
        ], [
            'name.required'      => 'O nome é obrigatório.',
            'name.min'           => 'O nome deve ter pelo menos 2 caracteres.',
            'email.required'     => 'O e-mail é obrigatório.',
            'email.unique'       => 'Este e-mail já está sendo usado.',
            'email.email'        => 'Informe um e-mail válido.',
            'password.required'  => 'A senha é obrigatória.',
            'password.confirmed' => 'As senhas não coincidem.',
            'status.required'    => 'O status é obrigatório.',
        ]);

        $admin = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id'  => RoleUser::$ADMIN,
            'status'   => $data['status'],
        ]);

        return redirect()
            ->route('admin.user.admin.show', $admin->id)
            ->with('success', 'Administrador criado com sucesso.');
    }

    public function show(User $admin)
    {
        $this->ensureAdmin();
        abort_unless($admin->isAdmin(), 404);

        return Inertia::render('Admin/User/Admin/Show/Page', [
            'admin' => $admin->only(['id', 'name', 'email', 'status', 'status_nome', 'role_name', 'cadastrado_em', 'email_verified_at']),
        ]);
    }

    public function edit(User $admin)
    {
        $this->ensureAdmin();
        abort_unless($admin->isAdmin(), 404);

        return Inertia::render('Admin/User/Admin/Edit/Page', [
            'admin' => $admin->only(['id', 'name', 'email', 'status']),
        ]);
    }

    public function update(Request $request, User $admin)
    {
        $this->ensureAdmin();
        abort_unless($admin->isAdmin(), 404);

        $data = $request->validate([
            'name'     => ['required', 'string', 'min:2', 'max:120'],
            'email'    => ['required', 'email', 'max:200', "unique:users,email,{$admin->id}"],
            'password' => ['nullable', Password::min(6)->letters()->numbers(), 'confirmed'],
            'status'   => ['required', 'string'],
        ], [
            'name.required'      => 'O nome é obrigatório.',
            'email.required'     => 'O e-mail é obrigatório.',
            'email.unique'       => 'Este e-mail já está sendo usado por outra conta.',
            'password.confirmed' => 'As senhas não coincidem.',
        ]);

        $updates = [
            'name'   => $data['name'],
            'email'  => $data['email'],
            'status' => $data['status'],
        ];

        if (!empty($data['password'])) {
            $updates['password'] = Hash::make($data['password']);
        }

        if ($admin->email !== $data['email']) {
            $updates['email_verified_at'] = null;
        }

        $admin->update($updates);

        return redirect()
            ->route('admin.user.admin.show', $admin->id)
            ->with('success', 'Administrador atualizado com sucesso.');
    }

    public function destroy(User $admin)
    {
        $this->ensureAdmin();
        abort_unless($admin->isAdmin(), 404);
        abort_if($admin->id === auth()->id(), 403, 'Você não pode excluir sua própria conta.');

        $admin->delete();

        return redirect()
            ->route('admin.user.admin.index')
            ->with('success', 'Administrador removido com sucesso.');
    }
}
