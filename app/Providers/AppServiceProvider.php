<?php

namespace App\Providers;

use App\Listeners\LogUserLogin;
use App\Listeners\LogUserLogout;
use App\Models\Cliente\ClientProfile;
use App\Models\Proposta\CommercialProposal;
use App\Policies\ClientProfilePolicy;
use App\Policies\CommercialProposalPolicy;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(ClientProfile::class, ClientProfilePolicy::class);
        Gate::policy(CommercialProposal::class, CommercialProposalPolicy::class);

        // Rastreamento automático de login/logout
        Event::listen(Login::class,  LogUserLogin::class);
        Event::listen(Logout::class, LogUserLogout::class);
    }
}
