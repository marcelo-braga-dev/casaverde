<?php

use App\Models\Produtor\ProducerAdministrationFeeRules;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\ProducerProposal;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Services\Config\SystemSettingService;
use App\Services\Proposta\CalculateProducerProposalInvestmentService;
use App\src\Proposta\ProposalStatus;

function createProducerProposal(array $overrides = []): ProducerProposal
{
    $consultor = $overrides['consultor'] ?? User::factory()->consultor()->create();

    $concessionaria = $overrides['concessionaria'] ?? Concessionaria::factory()->create([
        'tarifa_gd2' => 0.85,
    ]);

    $producer = $overrides['producer'] ?? ProducerProfile::factory()->create([
        'consultor_user_id' => $consultor->id,
    ]);

    return ProducerProposal::create([
        'producer_profile_id' => $producer->id,
        'consultor_user_id' => $consultor->id,
        'concessionaria_id' => $concessionaria->id,
        'status' => ProposalStatus::EMITIDA,
        'issued_at' => now(),
        'media_geracao' => $overrides['media_geracao'] ?? 1000,
        'fill_percent' => $overrides['fill_percent'] ?? 12,
        'valor_investimento' => $overrides['valor_investimento'] ?? 50000,
        'prazo_contrato' => $overrides['prazo_contrato'] ?? 36,
        'potencia_usina' => $overrides['potencia_usina'] ?? 75,
    ]);
}

describe('CalculateProducerProposalInvestmentService', function () {

    it('calculates the investment summary from the concessionaria tariff and the active fee rule', function () {
        app(SystemSettingService::class)->set('producer_proposal_consumer_discount_percentage', 20, 'float');

        $proposal = createProducerProposal(['media_geracao' => 1000]);

        ProducerAdministrationFeeRules::create([
            'producer_profile_id' => $proposal->producer_profile_id,
            'fee_percent' => 12,
            'starts_on' => now()->subDay(),
            'ends_on' => null,
            'is_active' => true,
        ]);

        $proposal->load(['producerProfile.activeFeeRule', 'concessionaria']);

        $summary = app(CalculateProducerProposalInvestmentService::class)->handle($proposal);

        $bruto = 12000 * 0.85;

        $consumerDiscountValue = round(0.85 * 0.2, 4);
        $adminFeeValueKwh = round(0.85 * 0.12, 4);

        expect($summary['tarifa_grupo_b'])->toEqual(0.85);
        expect($summary['consumer_discount_percent'])->toEqual(20.0);
        expect($summary['consumer_discount_value'])->toEqual($consumerDiscountValue);
        expect($summary['admin_fee_percent'])->toEqual(12.0);
        expect($summary['admin_fee_value_kwh'])->toEqual($adminFeeValueKwh);
        expect($summary['valor_pago_produtor_kwh'])->toEqual(round(0.85 - $consumerDiscountValue - $adminFeeValueKwh, 4));
        expect($summary['producao_anual_kwh'])->toEqual(12000.0);
        expect($summary['pagamento_anual_bruto'])->toEqual(round($bruto, 2));
        expect($summary['admin_fee_value'])->toEqual(round($bruto * 0.12, 2));
        expect($summary['pagamento_anual_liquido'])->toEqual(round($bruto * 0.88, 2));
        expect($summary['pagamento_mensal_previsto'])->toEqual(round(1000 * $summary['valor_pago_produtor_kwh'], 2));
    });

    it('falls back to the default producer fee percentage when there is no active fee rule', function () {
        app(SystemSettingService::class)->set('default_producer_fee_percentage', 15, 'float');

        $proposal = createProducerProposal(['media_geracao' => 500]);
        $proposal->load(['producerProfile.activeFeeRule', 'concessionaria']);

        $summary = app(CalculateProducerProposalInvestmentService::class)->handle($proposal);

        expect($summary['admin_fee_percent'])->toEqual(15.0);
    });
});

describe('Producer Proposal Show', function () {

    it('renders the proposal page with proposal and investmentSummary props', function () {
        app(SystemSettingService::class)->set('producer_proposal_consumer_discount_percentage', 20, 'float');

        $consultor = User::factory()->consultor()->create();
        $proposal = createProducerProposal(['consultor' => $consultor, 'media_geracao' => 1000]);

        ProducerAdministrationFeeRules::create([
            'producer_profile_id' => $proposal->producer_profile_id,
            'fee_percent' => 10,
            'starts_on' => now()->subDay(),
            'ends_on' => null,
            'is_active' => true,
        ]);

        $this->actingAs($consultor)
            ->get(route('consultor.propostas.produtor.show', $proposal->id))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Consultor/Propostas/Producer/Show/Page')
                ->has('proposal')
                ->has('investmentSummary')
                ->where('investmentSummary.tarifa_grupo_b', 0.85)
                ->where('investmentSummary.consumer_discount_percent', 20)
                ->where('investmentSummary.admin_fee_percent', 10)
                ->where('investmentSummary.producao_anual_kwh', 12000)
            );
    });

    it('returns 403 for produtor trying to access the consultor proposal page', function () {
        $produtor = User::factory()->produtor()->create();
        $proposal = createProducerProposal();

        $this->actingAs($produtor)
            ->get(route('consultor.propostas.produtor.show', $proposal->id))
            ->assertForbidden();
    });
});
