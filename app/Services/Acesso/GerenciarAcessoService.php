<?php

namespace App\Services\Acesso;

use App\Models\Acesso\UserAccessLog;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class GerenciarAcessoService
{
    /**
     * Cria ou atualiza o usuário de plataforma para um cliente ou produtor.
     * Vincula o user_id ao perfil correspondente via callback.
     */
    public function criarOuAtualizar(
        string $name,
        string $email,
        string $password,
        int    $roleId,
        callable $vincularAoPerfil,
        ?int   $existingUserId = null,
    ): User {
        return DB::transaction(function () use ($name, $email, $password, $roleId, $vincularAoPerfil, $existingUserId) {
            $isNew = is_null($existingUserId);

            if ($isNew) {
                // Cria novo usuário
                $user = User::create([
                    'name'    => $name,
                    'email'   => $email,
                    'password'=> Hash::make($password),
                    'role_id' => $roleId,
                    'status'  => '1',
                    'email_verified_at' => now(),
                ]);
            } else {
                $user = User::findOrFail($existingUserId);
                $updates = ['name' => $name, 'email' => $email];
                if ($password) {
                    $updates['password'] = Hash::make($password);
                }
                $user->update($updates);
            }

            // Vincula ao perfil (cliente ou produtor)
            $vincularAoPerfil($user->id);

            // Log do evento
            UserAccessLog::record(
                userId: $user->id,
                event:  $isNew ? 'access_created' : 'access_updated',
                extra: [
                    'performed_by_user_id' => auth()->id(),
                    'notes' => $isNew
                        ? 'Acesso criado pelo administrador.'
                        : 'Credenciais atualizadas pelo administrador.',
                ],
            );

            return $user->fresh();
        });
    }

    /**
     * Bloqueia o acesso de um usuário.
     */
    public function bloquear(User $user, string $notes = ''): void
    {
        $user->update(['status' => '0']);

        UserAccessLog::record(
            userId: $user->id,
            event:  'blocked',
            extra: [
                'performed_by_user_id' => auth()->id(),
                'notes' => $notes ?: 'Acesso bloqueado pelo administrador.',
            ],
        );
    }

    /**
     * Libera o acesso de um usuário.
     */
    public function liberar(User $user, string $notes = ''): void
    {
        $user->update(['status' => '1']);

        UserAccessLog::record(
            userId: $user->id,
            event:  'unblocked',
            extra: [
                'performed_by_user_id' => auth()->id(),
                'notes' => $notes ?: 'Acesso liberado pelo administrador.',
            ],
        );
    }

    /**
     * Retorna o histórico de acesso de um usuário (últimos N registros).
     */
    public function historico(int $userId, int $limit = 20): array
    {
        return UserAccessLog::query()
            ->where('user_id', $userId)
            ->with('performedBy')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn ($log) => [
                'id'             => $log->id,
                'event'          => $log->event,
                'event_label'    => $log->event_label,
                'event_color'    => $log->event_color,
                'ip_address'     => $log->ip_address,
                'user_agent'     => $this->simplifyUserAgent($log->user_agent),
                'performed_by'   => $log->performedBy?->name,
                'notes'          => $log->notes,
                'created_at'     => $log->created_at?->format('d/m/Y H:i:s'),
            ])
            ->toArray();
    }

    private function simplifyUserAgent(?string $ua): ?string
    {
        if (!$ua) return null;
        if (str_contains($ua, 'Chrome'))  return 'Chrome';
        if (str_contains($ua, 'Firefox')) return 'Firefox';
        if (str_contains($ua, 'Safari'))  return 'Safari';
        if (str_contains($ua, 'Edge'))    return 'Edge';
        return mb_substr($ua, 0, 40);
    }
}
