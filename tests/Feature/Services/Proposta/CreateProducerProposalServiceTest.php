<?php

use App\Models\Produtor\ProducerAdministrationFeeRules;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Services\Config\SystemSettingService;
use App\Services\Proposta\CreateProducerProposalService;

describe('CreateProducerProposalService', function () {

    it('creates a new producer with a fee rule using the default producer fee percentage and applies it to the proposal', function () {
        $consultor = User::factory()->consultor()->create();
        $concessionaria = Concessionaria::factory()->create();

        app(SystemSettingService::class)->set('default_producer_fee_percentage', 18, 'float');

        $this->actingAs($consultor);

        $result = app(CreateProducerProposalService::class)->handle([
            'tipo_pessoa' => 'pf',
            'cpf' => '12345678901',
            'nome' => 'Novo Produtor',
            'concessionaria_id' => $concessionaria->id,
            'media_geracao' => 800,
        ]);

        $proposal = $result['proposal'];
        $producer = ProducerProfile::find($proposal->producer_profile_id);

        expect((float) $proposal->fill_percent)->toEqual(18.0);
        expect((float) $producer->activeFeeRule->fee_percent)->toEqual(18.0);
    });

    it('uses the existing producer active fee rule percentage for fill_percent', function () {
        $consultor = User::factory()->consultor()->create();
        $concessionaria = Concessionaria::factory()->create();
        $producer = ProducerProfile::factory()->create(['consultor_user_id' => $consultor->id]);

        ProducerAdministrationFeeRules::create([
            'producer_profile_id' => $producer->id,
            'fee_percent' => 25,
            'starts_on' => now()->subDay(),
            'ends_on' => null,
            'is_active' => true,
        ]);

        $this->actingAs($consultor);

        $result = app(CreateProducerProposalService::class)->handle([
            'producer_profile_id' => $producer->id,
            'tipo_pessoa' => 'pf',
            'concessionaria_id' => $concessionaria->id,
            'media_geracao' => 500,
        ]);

        expect((float) $result['proposal']->fill_percent)->toEqual(25.0);
        expect($result['producer_already_exists'])->toBeTrue();
    });
});
