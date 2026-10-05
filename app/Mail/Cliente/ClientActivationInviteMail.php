<?php

namespace App\Mail\Cliente;

use App\Models\Cliente\ClientAccessInvite;
use App\Services\Config\SystemSettingService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ClientActivationInviteMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ClientAccessInvite $invite
    ) {}

    public function build(SystemSettingService $settings)
    {
        return $this
            ->subject('Ative seu acesso à plataforma '.$settings->brandName())
            ->view('emails.cliente.activation-invite', [
                'invite' => $this->invite,
                'activationUrl' => route('cliente.activation.form', [
                    'token' => $this->invite->token,
                ]),
            ]);
    }
}
