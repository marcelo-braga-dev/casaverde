<?php

namespace App\Policies;

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use App\src\Roles\RoleUser;

class ClientProfilePolicy
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
            RoleUser::$CLIENTE,
        ], true);
    }

    public function view(User $user, ClientProfile $clientProfile): bool
    {
        if ($user->role_id === RoleUser::$CONSULTOR) {
            return (int) $clientProfile->consultor_user_id === (int) $user->id;
        }

        if ($user->role_id === RoleUser::$CLIENTE) {
            return (int) $clientProfile->platform_user_id === (int) $user->id;
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

    public function update(User $user, ClientProfile $clientProfile): bool
    {
        if ($user->role_id === RoleUser::$CONSULTOR) {
            return (int) $clientProfile->consultor_user_id === (int) $user->id;
        }

        return false;
    }
}