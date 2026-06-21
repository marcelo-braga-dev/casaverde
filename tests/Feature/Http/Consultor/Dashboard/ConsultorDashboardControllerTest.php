<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;

describe('Consultor Dashboard Controller', function () {

    it('renders dashboard page for consultor', function () {
        $consultor = User::factory()->consultor()->create();

        $this->actingAs($consultor)
            ->get(route('consultor.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Consultor/Dashboard/Page')
                ->has('dashboard')
                ->has('dashboard.summary')
                ->has('dashboard.recentClients')
                ->has('dashboard.recentProposals')
                ->has('dashboard.quickActions')
            );
    });

    it('renders dashboard for admin (who also has consultor access)', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('consultor.dashboard'))
            ->assertOk();
    });

    it('returns 403 for produtor trying to access consultor dashboard', function () {
        $produtor = User::factory()->produtor()->create();

        $this->actingAs($produtor)
            ->get(route('consultor.dashboard'))
            ->assertForbidden();
    });

    it('returns 403 for cliente trying to access consultor dashboard', function () {
        $cliente = User::factory()->cliente()->create();

        $this->actingAs($cliente)
            ->get(route('consultor.dashboard'))
            ->assertForbidden();
    });

    it('redirects unauthenticated users to login', function () {
        $this->get(route('consultor.dashboard'))
            ->assertRedirect(route('login'));
    });

    it('dashboard summary contains all expected metric keys', function () {
        $consultor = User::factory()->consultor()->create();

        $this->actingAs($consultor)
            ->get(route('consultor.dashboard'))
            ->assertInertia(fn ($page) => $page->has('dashboard.summary.clients_total')
                ->has('dashboard.summary.clients_active')
                ->has('dashboard.summary.clients_this_month')
                ->has('dashboard.summary.producers_total')
                ->has('dashboard.summary.producers_active')
                ->has('dashboard.summary.usinas_total')
                ->has('dashboard.summary.client_proposals_open')
                ->has('dashboard.summary.producer_proposals_open')
                ->has('dashboard.summary.leads_total')
                ->has('dashboard.summary.leads_this_month')
            );
    });

    it('dashboard metrics reflect only the consultor own data', function () {
        $consultor = User::factory()->consultor()->create();
        $other = User::factory()->consultor()->create();

        ClientProfile::factory()->count(3)->create(['consultor_user_id' => $consultor->id]);
        ClientProfile::factory()->count(5)->create(['consultor_user_id' => $other->id]);

        $this->actingAs($consultor)
            ->get(route('consultor.dashboard'))
            ->assertInertia(fn ($page) => $page->where('dashboard.summary.clients_total', 3)
            );
    });
});
