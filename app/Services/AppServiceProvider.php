<?php

namespace App\Providers;

use App\Models\Cliente\ClientProfile;
use App\Models\Proposta\CommercialProposal;
use App\Policies\ClientProfilePolicy;
use App\Policies\CommercialProposalPolicy;
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
    }
}