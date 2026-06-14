<?php

use App\Models\Users\User;

describe('Admin Dashboard Controller', function () {

    it('renders dashboard for admin user', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Dashboard/Page')
                ->has('dashboard')
                ->has('dashboard.summary')
                ->has('dashboard.quickReports')
            );
    });

    it('renders dashboard for consultor user', function () {
        $consultor = User::factory()->consultor()->create();

        $this->actingAs($consultor)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Dashboard/Page')
            );
    });

    it('returns 403 for produtor trying to access admin dashboard', function () {
        $produtor = User::factory()->produtor()->create();

        $this->actingAs($produtor)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    });

    it('returns 403 for cliente trying to access admin dashboard', function () {
        $cliente = User::factory()->cliente()->create();

        $this->actingAs($cliente)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    });

    it('redirects unauthenticated users to login', function () {
        $this->get(route('admin.dashboard'))
            ->assertRedirect(route('login'));
    });

    it('dashboard summary contains expected metric keys', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page->has('dashboard.summary.clients_total')
                ->has('dashboard.summary.clients_active')
                ->has('dashboard.summary.plants_total')
                ->has('dashboard.summary.bills_pending_review')
                ->has('dashboard.summary.charges_open_amount')
                ->has('dashboard.summary.charges_overdue_amount')
                ->has('dashboard.summary.charges_paid_amount_month')
                ->has('dashboard.summary.failed_payments')
            );
    });

    it('passes operationalAlertsSummary to the view', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page->has('operationalAlertsSummary')
                ->has('operationalAlertsSummary.open')
                ->has('operationalAlertsSummary.critical')
            );
    });
});
