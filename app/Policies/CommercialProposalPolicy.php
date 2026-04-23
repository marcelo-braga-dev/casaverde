<?php

namespace App\Policies;

use App\Models\Proposta\CommercialProposal;
use App\Models\Users\User;
use App\src\Roles\RoleUser;

class CommercialProposalPolicy
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
        ], true);
    }

    public function view(User $user, CommercialProposal $proposal): bool
    {
        if ($user->role_id === RoleUser::$CONSULTOR) {
            return (int) $proposal->consultor_user_id === (int) $user->id;
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

    public function update(User $user, CommercialProposal $proposal): bool
    {
        if ($user->role_id === RoleUser::$CONSULTOR) {
            return (int) $proposal->consultor_user_id === (int) $user->id;
        }

        return false;
    }
}