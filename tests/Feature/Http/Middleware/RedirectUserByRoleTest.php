<?php

use App\Models\Users\User;

describe('RedirectUserByRole middleware', function () {

    it('redirects admin to admin.dashboard', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get('/dashboard')
            ->assertRedirect(route('admin.dashboard'));
    });

    it('redirects consultor to consultor.dashboard', function () {
        $consultor = User::factory()->consultor()->create();

        $this->actingAs($consultor)
            ->get('/dashboard')
            ->assertRedirect(route('consultor.dashboard'));
    });

    it('redirects cliente to cliente.dashboard', function () {
        $cliente = User::factory()->cliente()->create();

        $this->actingAs($cliente)
            ->get('/dashboard')
            ->assertRedirect(route('cliente.dashboard'));
    });

    it('redirects produtor to produtor.dashboard', function () {
        $produtor = User::factory()->produtor()->create();

        $this->actingAs($produtor)
            ->get('/dashboard')
            ->assertRedirect(route('produtor.dashboard'));
    });

    it('allows unauthenticated request through without redirect', function () {
        $this->get('/dashboard')
            ->assertRedirect('/login');
    });
});
