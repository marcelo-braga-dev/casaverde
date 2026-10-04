<?php

use App\Models\Proposta\CommercialProposal;
use App\Models\Users\User;
use App\Services\Proposta\GenerateCommercialProposalPdfService;
use Illuminate\Support\Facades\View;

describe('PDF da proposta comercial', function () {

    beforeEach(function () {
        $this->proposal = CommercialProposal::factory()->create([
            'valor_medio' => 1000.00,
            'discount_percent' => 20.00,
            'prazo_locacao' => 24,
            'media_consumo' => 900,
        ]);
    });

    it('computes the savings shown in the modern template', function () {
        $numbers = app(GenerateCommercialProposalPdfService::class)->numbers($this->proposal);

        expect($numbers['new_bill'])->toBe(800.0)
            ->and($numbers['monthly'])->toBe(200.0)
            ->and($numbers['yearly'])->toBe(2400.0)
            ->and($numbers['contract'])->toBe(4800.0)
            ->and($numbers['new_bill_ratio'])->toEqual(80)
            ->and(collect($numbers['periods'])->last()['label'])->toBe('Contrato (24 meses)');
    });

    it('uses the original template outside demo mode and the modern one in demo mode', function (bool $demo, string $view) {
        config(['demo.enabled' => $demo]);
        $rendered = [];
        View::creator('pdf.propostas.*', function ($view) use (&$rendered) {
            $rendered[] = $view->getName();
        });

        app(GenerateCommercialProposalPdfService::class)->stream($this->proposal);

        expect($rendered)->toBe([$view]);
    })->with([
        'fora da demonstração' => [false, 'pdf.propostas.commercial-proposal'],
        'na demonstração' => [true, 'pdf.propostas.commercial-proposal-modern'],
    ]);

    it('renders both templates as a PDF', function (bool $demo) {
        config(['demo.enabled' => $demo]);

        $response = $this->actingAs(User::factory()->admin()->create())
            ->get(route('consultor.propostas.cliente.pdf', $this->proposal));

        $response->assertOk();
        expect($response->headers->get('content-type'))->toContain('application/pdf');
    })->with(['original' => false, 'demonstração' => true]);
});
