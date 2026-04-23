<?php

namespace App\Services\Cliente;

use App\Models\Cliente\ClientAccessInvite;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;

class ActivateClientAccountService
{
    public function handle(string $token, string $name, string $password): array
    {
        $invite = ClientAccessInvite::query()
            ->with('clientProfile')
            ->where('token', $token)
            ->first();

        if (!$invite) {
            throw new InvalidArgumentException('Convite inválido.');
        }

        if (!$invite->canBeUsed()) {
            throw new InvalidArgumentException('Este convite expirou ou já foi utilizado.');
        }

        $clientProfile = $invite->clientProfile;

        return DB::transaction(function () use ($invite, $clientProfile, $name, $password) {
            if ($clientProfile->platform_user_id) {
                throw new InvalidArgumentException('Este cliente já possui acesso à plataforma.');
            }

            $existingUser = User::query()
                ->where('email', $invite->email)
                ->first();

            if ($existingUser) {
                throw new InvalidArgumentException('Já existe um usuário cadastrado com este email.');
            }

            $user = User::create([
                'name' => $name,
                'email' => $invite->email,
                'password' => Hash::make($password),
                'role_id' => RoleUser::$CLIENTE,
                'consultor_id' => $clientProfile->consultor_user_id,
                'status' => 1,
            ]);

            $clientProfile->update([
                'platform_user_id' => $user->id,
                'status' => 'cliente_ativo',
                'is_active_client' => true,
                'activated_at' => now(),
            ]);

            $invite->update([
                'used_at' => now(),
            ]);

            return [
                'user' => $user,
                'client_profile' => $clientProfile->fresh(),
                'invite' => $invite->fresh(),
            ];
        });
    }
}