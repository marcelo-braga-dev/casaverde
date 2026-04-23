<?php

namespace App\Services\Cliente;

use App\Mail\Cliente\ClientActivationInviteMail;
use App\Models\Cliente\ClientAccessInvite;
use App\Models\Cliente\ClientProfile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;

class CreateClientAccessInviteService
{
    public function handle(ClientProfile $clientProfile, string $email, int $expiresInHours = 48): ClientAccessInvite
    {
        if (!$clientProfile->is_active_client) {
            throw new InvalidArgumentException('Somente clientes ativos podem receber convite de acesso.');
        }

        return DB::transaction(function () use ($clientProfile, $email, $expiresInHours) {
            $email = mb_strtolower(trim($email));

            $clientProfile->update([
                'email' => $email,
            ]);

            ClientAccessInvite::query()
                ->where('client_profile_id', $clientProfile->id)
                ->whereNull('used_at')
                ->update([
                    'expires_at' => now(),
                ]);

            $invite = ClientAccessInvite::create([
                'client_profile_id' => $clientProfile->id,
                'created_by_user_id' => auth()->id(),
                'email' => $email,
                'expires_at' => now()->addHours($expiresInHours),
            ]);

            Mail::to($invite->email)->send(new ClientActivationInviteMail($invite));

            return $invite;
        });
    }
}