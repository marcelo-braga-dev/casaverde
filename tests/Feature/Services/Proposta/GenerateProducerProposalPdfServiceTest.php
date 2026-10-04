<?php

use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Proposta\ProducerProposal;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Services\Proposta\GenerateProducerProposalPdfService;

describe('PDF da proposta de produtor', function () {

    beforeEach(function () {
        $this->consultor = User::factory()->consultor()->create();
        $this->proposal = ProducerProposal::create([
            'producer_profile_id' => ProducerProfile::factory()->create()->id,
            'consultor_user_id' => $this->consultor->id,
            'concessionaria_id' => Concessionaria::factory()->create(['tarifa_gd2' => 1.00])->id,
            'status' => 'enviada',
            'issued_at' => '2026-09-01',
            'valid_until' => '2026-10-01',
            'prazo_contrato' => 120,
            'media_geracao' => 10000,
            'potencia_usina' => 80,
            'valor_investimento' => 300000,
        ]);
    });

    it('computes revenue, payback and projection', function () {
        // Sem regra própria: desconto ao consumidor 20% e taxa de operação 15% (padrões).
        $numbers = app(GenerateProducerProposalPdfService::class)->numbers($this->proposal);

        expect($numbers['monthly'])->toEqual(6500)
            ->and($numbers['contract'])->toEqual(780000)
            ->and($numbers['payback_months'])->toBe(47)
            ->and($numbers['roi_percent'])->toEqual(160)
            ->and($numbers['split'])->toEqual(['producer' => 65, 'consumer' => 20, 'admin' => 15])
            ->and($numbers['projection']['years'])->toHaveCount(10)
            ->and($numbers['projection']['years'][2]['paid_back'])->toBeFalse()
            ->and($numbers['projection']['years'][3]['paid_back'])->toBeTrue();
    });

    it('streams the producer proposal, not a client proposal with the same id', function () {
        CommercialProposal::factory()->create();

        $response = $this->actingAs($this->consultor)
            ->get(route('consultor.propostas.produtor.pdf', $this->proposal));

        $response->assertOk();
        expect($response->headers->get('content-type'))->toContain('application/pdf')
            ->and($response->headers->get('content-disposition'))->toContain('proposta-produtor-PC'.$this->proposal->id);
    });

    it('blocks a consultor from another portfolio', function () {
        $this->actingAs(User::factory()->consultor()->create())
            ->get(route('consultor.propostas.produtor.pdf', $this->proposal))
            ->assertForbidden();
    });
});
