<?php

namespace App\Listeners;

use App\Models\Acesso\UserAccessLog;
use Illuminate\Auth\Events\Login;

class LogUserLogin
{
    public function handle(Login $event): void
    {
        UserAccessLog::record(
            userId: $event->user->id,
            event: 'login',
            extra: [
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ],
        );
    }
}
