<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;

describe('UpdateCustomerChargeDueDateController', function () {

    it('allows an admin to update the due date', function () {
        $admin = User::factory()->admin()->create();
        $charge = CustomerCharge::factory()->create(['status' => 'open', 'due_date' => '2026-08-10']);

        $response = $this->actingAs($admin)->put(
            route('admin.financeiro.cobrancas.update-due-date', $charge->id),
            ['due_date' => '2026-09-15']
        );

        $response->assertRedirect();
        $response->assertSessionHas('success');
        expect($charge->fresh()->due_date->format('Y-m-d'))->toBe('2026-09-15');
    });

    it('allows the responsible consultor to update the due date of their own client', function () {
        $consultor = User::factory()->consultor()->create();
        $client = ClientProfile::factory()->create(['consultor_user_id' => $consultor->id]);
        $charge = CustomerCharge::factory()->create([
            'client_profile_id' => $client->id,
            'status' => 'open',
            'due_date' => '2026-08-10',
        ]);

        $response = $this->actingAs($consultor)->put(
            route('admin.financeiro.cobrancas.update-due-date', $charge->id),
            ['due_date' => '2026-09-15']
        );

        $response->assertRedirect();
        expect($charge->fresh()->due_date->format('Y-m-d'))->toBe('2026-09-15');
    });

    it('forbids a consultor from updating the due date of another consultor client', function () {
        $consultor = User::factory()->consultor()->create();
        $otherClient = ClientProfile::factory()->create();
        $charge = CustomerCharge::factory()->create([
            'client_profile_id' => $otherClient->id,
            'status' => 'open',
            'due_date' => '2026-08-10',
        ]);

        $response = $this->actingAs($consultor)->put(
            route('admin.financeiro.cobrancas.update-due-date', $charge->id),
            ['due_date' => '2026-09-15']
        );

        $response->assertForbidden();
        expect($charge->fresh()->due_date->format('Y-m-d'))->toBe('2026-08-10');
    });

    it('redirects back with a friendly error when the charge is paid', function () {
        $admin = User::factory()->admin()->create();
        $charge = CustomerCharge::factory()->paid()->create(['due_date' => '2026-08-10']);

        $response = $this->actingAs($admin)->put(
            route('admin.financeiro.cobrancas.update-due-date', $charge->id),
            ['due_date' => '2026-09-15']
        );

        $response->assertRedirect();
        $response->assertSessionHas('error');
        expect($charge->fresh()->due_date->format('Y-m-d'))->toBe('2026-08-10');
    });

    it('validates that due_date is required and a valid date', function () {
        $admin = User::factory()->admin()->create();
        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        $response = $this->actingAs($admin)->put(
            route('admin.financeiro.cobrancas.update-due-date', $charge->id),
            ['due_date' => 'not-a-date']
        );

        $response->assertSessionHasErrors('due_date');
    });

});
