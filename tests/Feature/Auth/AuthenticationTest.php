<?php

use App\Models\Acesso\UserAccessLog;
use App\Models\Users\User;
use App\src\Roles\RoleUser;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});

test('blocked users can not authenticate', function () {
    $user = User::factory()->create(['status' => '0']);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
    expect(UserAccessLog::where('user_id', $user->id)->where('event', 'login')->exists())->toBeFalse();
});

test('blocked users with an open session are logged out', function () {
    $user = User::factory()->create(['status' => '0', 'role_id' => RoleUser::$ADMIN]);

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $this->assertGuest();
    $response->assertRedirect(route('login'));
});
