<?php

namespace App\Providers;

use App\Listeners\LogUserLogin;
use App\Listeners\LogUserLogout;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Usina\UsinaSolar;
use App\Policies\ClientProfilePolicy;
use App\Policies\CommercialProposalPolicy;
use App\Policies\CustomerChargePolicy;
use App\Policies\ProducerProfilePolicy;
use App\Policies\UsinaSolarPolicy;
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
        Gate::policy(UsinaSolar::class, UsinaSolarPolicy::class);
        Gate::policy(CustomerCharge::class, CustomerChargePolicy::class);
        Gate::policy(ProducerProfile::class, ProducerProfilePolicy::class);

        // Rastreamento automático de login/logout
        Event::listen(Login::class, LogUserLogin::class);
        Event::listen(Logout::class, LogUserLogout::class);
    }
}
