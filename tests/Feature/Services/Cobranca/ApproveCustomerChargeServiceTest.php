<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;
use App\Services\Cobranca\ApproveCustomerChargeService;

describe('ApproveCustomerChargeService', function () {

    beforeEach(function () {
        $this->service = app(ApproveCustomerChargeService::class);
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('transitions a draft charge to open status', function () {
        $charge = CustomerCharge::factory()->draft()->create();

        $updated = $this->service->handle($charge);

        expect($updated->status)->toBe('open');

        $this->assertDatabaseHas('customer_charges', [
            'id' => $charge->id,
            'status' => 'open',
        ]);
    });

    it('sets approved_by_user_id to the authenticated user', function () {
        $charge = CustomerCharge::factory()->draft()->create();
        $updated = $this->service->handle($charge);

        expect($updated->approved_by_user_id)->toBe($this->admin->id);
    });

    it('sets approved_at timestamp on approval', function () {
        $charge = CustomerCharge::factory()->draft()->create();
        $updated = $this->service->handle($charge);

        expect($updated->approved_at)->not()->toBeNull();
    });

    it('throws InvalidArgumentException when charge is not in draft status', function () {
        $charge = CustomerCharge::factory()->open()->create();

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('rascunho');

        $this->service->handle($charge);
    });

    it('throws when trying to approve a paid charge', function () {
        $charge = CustomerCharge::factory()->paid()->create();

        $this->expectException(InvalidArgumentException::class);

        $this->service->handle($charge);
    });

    it('throws when trying to approve a cancelled charge', function () {
        $charge = CustomerCharge::factory()->cancelled()->create();

        $this->expectException(InvalidArgumentException::class);

        $this->service->handle($charge);
    });

    it('returns a fresh charge instance', function () {
        $charge = CustomerCharge::factory()->draft()->create();
        $updated = $this->service->handle($charge);

        expect($updated)->toBeInstanceOf(CustomerCharge::class)
            ->and($updated->id)->toBe($charge->id);
    });
});
