<?php

use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ConcessionaireBillIssue;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Services\Fatura\ApproveConcessionaireBillService;

function approvableBill(array $overrides = []): ConcessionaireBill
{
    return ConcessionaireBill::factory()->create([
        'nome' => 'Titular',
        'concessionaria_id' => Concessionaria::factory(),
        'pdf_original_name' => 'fatura.pdf',
        'injected_consumption_amount' => -300.00,
        'injected_consumption_discount_percent' => 15,
        ...$overrides,
    ]);
}

describe('Approving concessionaire bills', function () {

    beforeEach(function () {
        $this->service = app(ApproveConcessionaireBillService::class);
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('approves a complete bill', function () {
        $bill = approvableBill();

        $approved = $this->service->handle($bill);

        expect($approved->review_status)->toBe('approved')
            ->and($approved->reviewed_by_user_id)->toBe($this->admin->id);
    });

    it('lists what blocks the approval of an incomplete bill', function () {
        $bill = approvableBill(['nome' => null, 'injected_consumption_amount' => null]);
        ConcessionaireBillIssue::create([
            'concessionaire_bill_id' => $bill->id,
            'issue_code' => 'invalid_total_value',
            'severity' => 'error',
            'message' => 'Valor inválido',
            'is_resolved' => false,
        ]);

        expect($this->service->blockers($bill))->toBe([
            'Falta nome do titular',
            'Sem valor de consumo injetado (a cobrança sairia zerada)',
            '1 pendência(s) em aberto',
        ]);

        expect(fn () => $this->service->handle($bill))->toThrow(InvalidArgumentException::class);
        expect($bill->fresh()->review_status)->toBe('pending_review');
    });

    it('ignores warnings that are only informative', function () {
        $bill = approvableBill();
        ConcessionaireBillIssue::create([
            'concessionaire_bill_id' => $bill->id,
            'issue_code' => 'invalid_consumption',
            'severity' => 'warning',
            'message' => 'Consumo fora do padrão',
            'is_resolved' => false,
        ]);

        expect($this->service->blockers($bill))->toBe([]);
    });

    it('approves in batch only the bills that pass validation', function () {
        $ok = approvableBill();
        $incomplete = approvableBill(['pdf_original_name' => null]);
        $already = approvableBill(['review_status' => 'approved']);

        $result = $this->service->handleMany([$ok->id, $incomplete->id, $already->id]);

        expect($result['approved'])->toBe(1)
            ->and(array_keys($result['skipped']))->toEqualCanonicalizing([$incomplete->id, $already->id])
            ->and($ok->fresh()->review_status)->toBe('approved')
            ->and($incomplete->fresh()->review_status)->toBe('pending_review');
    });

    it('exposes the batch action to admins only, requiring the injected values confirmation', function () {
        $bill = approvableBill();

        $this->post(route('consultor.cliente.faturas.approve-batch'), ['ids' => [$bill->id]])
            ->assertSessionHasErrors('injected_values_confirmed');

        $this->post(route('consultor.cliente.faturas.approve-batch'), ['ids' => [$bill->id], 'injected_values_confirmed' => true])
            ->assertSessionHas('success');

        expect($bill->fresh()->review_status)->toBe('approved');

        $other = approvableBill();
        $this->actingAs(User::factory()->consultor()->create())
            ->post(route('consultor.cliente.faturas.approve-batch'), ['ids' => [$other->id], 'injected_values_confirmed' => true])
            ->assertForbidden();

        expect($other->fresh()->review_status)->toBe('pending_review');
    });

    it('refuses the single approval of an incomplete bill on the server too', function () {
        $bill = approvableBill(['numero_instalacao' => null]);

        $this->post(route('consultor.cliente.faturas.approve', $bill))->assertSessionHas('error');

        expect($bill->fresh()->review_status)->toBe('pending_review');
    });

    it('shows the batch eligibility and the estimated charge in the bill list', function () {
        approvableBill(['created_at' => now()]);

        $item = $this->get(route('admin.relatorios.faturas'))->viewData('page')['props']['report']['items'][0];

        expect($item['approval_blockers'])->toBe([])
            ->and($item['charge_estimate'])->toBe(255.0);
    });
});
