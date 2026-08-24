<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;
use App\Services\Cobranca\MarkCustomerChargeAsPaidService;

describe('MarkCustomerChargeAsPaidService', function () {

    beforeEach(function () {
        $this->service = app(MarkCustomerChargeAsPaidService::class);
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('marks an open charge as paid', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);

        $updated = $this->service->handle($charge, 'Pago via Pix direto');

        expect($updated->status)->toBe('paid')
            ->and($updated->paid_at)->not->toBeNull()
            ->and($updated->notes)->toContain('Pago via Pix direto');
    });

    it('marks an overdue charge as paid', function () {
        $charge = CustomerCharge::factory()->overdue()->create();

        $updated = $this->service->handle($charge);

        expect($updated->status)->toBe('paid');
    });

    it('throws when the charge is cancelled', function () {
        $charge = CustomerCharge::factory()->cancelled()->create();

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Não é possível pagar uma cobrança cancelada.');
    });

    it('throws when the charge is already paid', function () {
        $charge = CustomerCharge::factory()->paid()->create();

        expect(fn () => $this->service->handle($charge))
            ->toThrow(InvalidArgumentException::class, 'Esta cobrança já está paga.');
    });

    it('logs a history entry', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $this->service->handle($charge, 'Depósito confirmado');

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'user_id' => $this->admin->id,
            'action' => 'marked_paid',
            'description' => 'Pagamento manual: Depósito confirmado',
        ]);
    });

    it('logs a generic history entry when no note is given', function () {
        $charge = CustomerCharge::factory()->create(['status' => 'open']);
        $this->service->handle($charge);

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'action' => 'marked_paid',
            'description' => 'Cobrança marcada como paga manualmente.',
        ]);
    });

});
