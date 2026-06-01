<?php

use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\Route;

describe('EnsureUserHasRole middleware', function () {

    beforeEach(function () {
        Route::middleware(['web', 'auth', 'role:admin'])->get('/_test/admin-only', function () {
            return response()->json(['ok' => true]);
        });

        Route::middleware(['web', 'auth', 'role:admin,consultor'])->get('/_test/admin-or-consultor', function () {
            return response()->json(['ok' => true]);
        });

        Route::middleware(['web', 'auth', 'role:cliente'])->get('/_test/cliente-only', function () {
            return response()->json(['ok' => true]);
        });
    });

    it('allows admin to access admin-only route', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get('/_test/admin-only')
            ->assertOk();
    });

    it('blocks consultor from admin-only route with 403', function () {
        $consultor = User::factory()->consultor()->create();

        $this->actingAs($consultor)
            ->get('/_test/admin-only')
            ->assertForbidden();
    });

    it('blocks produtor from admin-only route with 403', function () {
        $produtor = User::factory()->produtor()->create();

        $this->actingAs($produtor)
            ->get('/_test/admin-only')
            ->assertForbidden();
    });

    it('blocks cliente from admin-only route with 403', function () {
        $cliente = User::factory()->cliente()->create();

        $this->actingAs($cliente)
            ->get('/_test/admin-only')
            ->assertForbidden();
    });

    it('allows admin to access admin-or-consultor route', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get('/_test/admin-or-consultor')
            ->assertOk();
    });

    it('allows consultor to access admin-or-consultor route', function () {
        $consultor = User::factory()->consultor()->create();

        $this->actingAs($consultor)
            ->get('/_test/admin-or-consultor')
            ->assertOk();
    });

    it('blocks produtor from admin-or-consultor route', function () {
        $produtor = User::factory()->produtor()->create();

        $this->actingAs($produtor)
            ->get('/_test/admin-or-consultor')
            ->assertForbidden();
    });

    it('allows cliente to access cliente-only route', function () {
        $cliente = User::factory()->cliente()->create();

        $this->actingAs($cliente)
            ->get('/_test/cliente-only')
            ->assertOk();
    });

    it('redirects unauthenticated users to login', function () {
        $this->get('/_test/admin-only')
            ->assertRedirect('/login');
    });
});
