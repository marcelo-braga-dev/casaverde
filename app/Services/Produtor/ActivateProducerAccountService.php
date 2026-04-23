<?php

namespace App\Services\Produtor;

use App\Models\Produtor\ProducerAccessInvite;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ActivateProducerAccountService
{
    public function handle(string $token, string $name, string $password): array
    {
        return DB::transaction(function () use ($token, $name, $password) {
            $invite = ProducerAccessInvite::query()
                ->with('producerProfile')
                ->where('token', $token)
                ->lockForUpdate()
                ->first();

            if (!$invite || !$invite->canBeUsed()) {
                throw ValidationException::withMessages([
                    'token' => 'Convite inválido, expirado ou já utilizado.',
                ]);
            }

            $producerProfile = $invite->producerProfile;

            if (!$producerProfile) {
                throw ValidationException::withMessages([
                    'token' => 'Perfil do produtor não encontrado.',
                ]);
            }

            $user = User::query()->create([
                'name' => $name,
                'email' => $invite->email,
                'password' => $password,
                'role_id' => RoleUser::$PRODUTOR,
                'consultor_id' => optional($producerProfile->createdBy)->id,
                'status' => '1',
            ]);

            $producerProfile->update([
                'user_id' => $user->id,
            ]);

            $invite->markAsUsed();

            return [
                'user' => $user,
                'producer_profile' => $producerProfile->fresh(),
                'invite' => $invite->fresh(),
            ];
        });
    }
}