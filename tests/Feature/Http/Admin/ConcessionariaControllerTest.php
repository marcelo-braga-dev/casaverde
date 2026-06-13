<?php

use App\Models\Users\User;
use App\Models\Usina\Concessionaria;

describe('Concessionaria CRUD', function () {

    it('lists concessionarias for admin', function () {
        $admin = User::factory()->admin()->create();
        Concessionaria::factory()->count(3)->create();

        $this->actingAs($admin)
            ->get(route('admin.concessionaria.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Concessionaria/Index/Page')
                ->has('concessionarias.data', 3)
            );
    });

    it('renders the create page for admin', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('admin.concessionaria.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Concessionaria/Create/Page'));
    });

    it('allows admin to create a concessionaria', function () {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.concessionaria.store'), [
                'nome' => 'Concessionária Teste',
                'tarifa_gd2' => 0.92,
                'estado' => 'sp',
                'status' => 'ativo',
            ])
            ->assertRedirect();

        $concessionaria = Concessionaria::where('nome', 'Concessionária Teste')->first();

        expect($concessionaria)->not->toBeNull();
        expect($concessionaria->estado)->toBe('SP');
        expect((float) $concessionaria->tarifa_gd2)->toEqual(0.92);
    });

    it('allows admin to update the tarifa_gd2 of a concessionaria', function () {
        $admin = User::factory()->admin()->create();
        $concessionaria = Concessionaria::factory()->create(['tarifa_gd2' => 0.80]);

        $this->actingAs($admin)
            ->put(route('admin.concessionaria.update', $concessionaria->id), [
                'nome' => $concessionaria->nome,
                'tarifa_gd2' => 0.95,
                'estado' => $concessionaria->estado,
                'status' => 'ativo',
            ])
            ->assertRedirect(route('admin.concessionaria.show', $concessionaria->id));

        expect((float) $concessionaria->refresh()->tarifa_gd2)->toEqual(0.95);
    });

    it('forbids consultor from creating a concessionaria', function () {
        $consultor = User::factory()->consultor()->create();

        $this->actingAs($consultor)
            ->post(route('admin.concessionaria.store'), [
                'nome' => 'Outra Concessionária',
                'tarifa_gd2' => 0.7,
                'estado' => 'RJ',
                'status' => 'ativo',
            ])
            ->assertForbidden();
    });
});
