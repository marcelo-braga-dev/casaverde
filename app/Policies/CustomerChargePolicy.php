<?php

namespace App\Policies;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;
use App\src\Roles\RoleUser;

class CustomerChargePolicy
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

    public function view(User $user, CustomerCharge $charge): bool
    {
        if ($user->role_id === RoleUser::$CONSULTOR) {
            return (int) $charge->clientProfile?->consultor_user_id === (int) $user->id;
        }

        if ($user->role_id === RoleUser::$CLIENTE) {
            return (int) $charge->clientProfile?->platform_user_id === (int) $user->id;
        }

        return false;
    }

    public function update(User $user, CustomerCharge $charge): bool
    {
        if ($user->role_id === RoleUser::$CONSULTOR) {
            return (int) $charge->clientProfile?->consultor_user_id === (int) $user->id;
        }

        return false;
    }
}
