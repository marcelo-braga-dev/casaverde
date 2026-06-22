<?php

namespace App\Policies;

use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;
use App\src\Roles\RoleUser;

class UsinaSolarPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role_id === RoleUser::$ADMIN) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return in_array($user->role_id, [
            RoleUser::$CONSULTOR,
            RoleUser::$PRODUTOR,
        ], true);
    }

    public function view(User $user, UsinaSolar $usina): bool
    {
        if ($user->role_id === RoleUser::$CONSULTOR) {
            return (int) $usina->consultor_user_id === (int) $user->id;
        }

        if ($user->role_id === RoleUser::$PRODUTOR) {
            return (int) $usina->produtor?->platform_user_id === (int) $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return in_array($user->role_id, [
            RoleUser::$ADMIN,
            RoleUser::$CONSULTOR,
        ], true);
    }

    public function update(User $user, UsinaSolar $usina): bool
    {
        if ($user->role_id === RoleUser::$CONSULTOR) {
            return (int) $usina->consultor_user_id === (int) $user->id;
        }

        return false;
    }
}
