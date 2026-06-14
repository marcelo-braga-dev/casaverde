<?php

namespace App\Listeners;

use App\Models\Acesso\UserAccessLog;
use Illuminate\Auth\Events\Logout;

class LogUserLogout
{
    public function handle(Logout $event): void
    {
        if (! $event->user) {
            return;
        }

        UserAccessLog::record(
            userId: $event->user->id,
            event: 'logout',
            extra: [
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ],
        );
    }
}
