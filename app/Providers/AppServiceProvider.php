<?php

namespace App\Providers;

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
use App\Services\Alert\SystemFailureAlertService;
use Illuminate\Console\Events\ScheduledTaskFailed;
use Illuminate\Queue\Events\JobFailed;
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

        Event::listen(JobFailed::class, fn (JobFailed $event) => app(SystemFailureAlertService::class)->jobFailed($event));
        Event::listen(ScheduledTaskFailed::class, fn (ScheduledTaskFailed $event) => app(SystemFailureAlertService::class)->scheduledTaskFailed($event));
    }
}
