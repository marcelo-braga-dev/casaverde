<?php

use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;
use Inertia\Testing\AssertableInertia as Assert;

describe('Gestão de Energia (usinas)', function () {

    beforeEach(function () {
        $this->actingAs(User::factory()->admin()->create());

        $this->pj = UsinaSolar::factory()->create([
            'usina_nome' => 'Usina Solar Bela Vista',
            'producer_profile_id' => ProducerProfile::factory()->create([
                'tipo_pessoa' => 'pj', 'nome' => null, 'razao_social' => 'Agropecuária Bela Vista LTDA',
            ])->id,
        ]);
        $this->pf = UsinaSolar::factory()->create([
            'usina_nome' => 'Usina Solar Recanto',
            'producer_profile_id' => ProducerProfile::factory()->create([
                'tipo_pessoa' => 'pf', 'nome' => 'Helena Martins Prado',
            ])->id,
        ]);
    });

    it('exposes the producer name for PF and PJ producers', function () {
        $this->get(route('admin.usinas.management'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('usinas.data', fn ($usinas) => collect($usinas)->pluck('produtor.display_name')->sort()->values()->all()
                    === ['Agropecuária Bela Vista LTDA', 'Helena Martins Prado']));
    });

    it('searches by producer name, company name or plant name without errors', function (string $term, string $expected) {
        $this->get(route('admin.usinas.management', ['search' => $term]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('usinas.data', 1)
                ->where('usinas.data.0.usina_nome', $expected));
    })->with([
        ['Helena', 'Usina Solar Recanto'],
        ['Agropecuária', 'Usina Solar Bela Vista'],
        ['Recanto', 'Usina Solar Recanto'],
    ]);
});
