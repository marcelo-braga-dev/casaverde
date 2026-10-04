<?php

use App\Models\Produtor\ProducerLead;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use Inertia\Testing\AssertableInertia as Assert;

describe('Leads de produtores', function () {

    beforeEach(function () {
        $this->consultor = User::factory()->consultor()->create();
        $producerUser = User::factory()->create(['name' => 'Granja Santa Clara']);

        $this->lead = ProducerLead::create([
            'consultor_user_id' => $this->consultor->id,
            'producer_profile_id' => ProducerProfile::factory()->create([
                'tipo_pessoa' => 'pj',
                'nome' => null,
                'razao_social' => 'Granja Santa Clara LTDA',
                'status' => 'em_integracao',
                'consultor_user_id' => $this->consultor->id,
                'platform_user_id' => $producerUser->id,
            ])->id,
            'potencia' => 300,
            'status' => 'aprovado',
        ]);

        $this->actingAs($this->consultor);
    });

    // Leads com produtor vinculado quebravam com "undefined relationship [user]".
    it('lists leads linked to a producer profile', function () {
        $this->get(route('consultor.producer.leads.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('leads.data.0.producer_profile.display_name', 'Granja Santa Clara LTDA')
                ->where('leads.data.0.producer_profile.platform_user.name', 'Granja Santa Clara'));
    });

    it('shows a lead linked to a producer profile', function () {
        $this->get(route('consultor.producer.leads.show', $this->lead))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('lead.producer_profile.platform_user.name', 'Granja Santa Clara'));
    });
});
