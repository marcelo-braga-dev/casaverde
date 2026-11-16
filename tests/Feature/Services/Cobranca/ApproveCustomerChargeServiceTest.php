<?php

use App\Models\Cliente\ClientProfile;
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

    it('logs a history entry when approving', function () {
        $charge = CustomerCharge::factory()->draft()->create();
        $this->service->handle($charge);

        $this->assertDatabaseHas('customer_charge_histories', [
            'customer_charge_id' => $charge->id,
            'user_id' => $this->admin->id,
            'action' => 'approved',
            'description' => 'Cobrança aberta para pagamento.',
        ]);
    });

    it('refuses to open a draft whose due date already passed, or with zero value', function () {
        $late = CustomerCharge::factory()->draft()->create(['due_date' => now()->subDay()->toDateString()]);
        $zero = CustomerCharge::factory()->draft()->create(['final_amount' => 0]);

        expect(fn () => $this->service->handle($late))->toThrow(InvalidArgumentException::class, 'já passou')
            ->and(fn () => $this->service->handle($zero))->toThrow(InvalidArgumentException::class, 'zerado')
            ->and($late->fresh()->status)->toBe('draft');
    });

    it('opens drafts in batch, moving only the past due dates to the new one', function () {
        $late = CustomerCharge::factory()->draft()->create(['due_date' => now()->subDays(10)->toDateString()]);
        $onTime = CustomerCharge::factory()->draft()->create(['due_date' => now()->addDays(20)->toDateString()]);
        $notDraft = CustomerCharge::factory()->open()->create();
        $newDue = now()->addDays(7)->toDateString();

        $this->post(route('admin.financeiro.cobrancas.open-batch'), [
            'ids' => [$late->id, $onTime->id, $notDraft->id],
            'due_date' => $newDue,
        ])->assertSessionHas('success');

        expect($late->fresh()->status)->toBe('open')
            ->and($late->fresh()->due_date->toDateString())->toBe($newDue)
            ->and($onTime->fresh()->status)->toBe('open')
            ->and($onTime->fresh()->due_date->toDateString())->toBe(now()->addDays(20)->toDateString());
    });

    it('skips past due drafts in batch when no new due date is given', function () {
        $late = CustomerCharge::factory()->draft()->create(['due_date' => now()->subDays(10)->toDateString()]);

        $this->post(route('admin.financeiro.cobrancas.open-batch'), ['ids' => [$late->id]])->assertSessionHas('error');

        expect($late->fresh()->status)->toBe('draft');
    });

    it('rejects a new due date in the past', function () {
        $draft = CustomerCharge::factory()->draft()->create();

        $this->post(route('admin.financeiro.cobrancas.open-batch'), ['ids' => [$draft->id], 'due_date' => now()->subDay()->toDateString()])
            ->assertSessionHasErrors('due_date');
    });

    it('lets a consultor open in batch only the charges of their own portfolio', function () {
        $consultor = User::factory()->consultor()->create();
        $own = CustomerCharge::factory()->draft()->create([
            'client_profile_id' => ClientProfile::factory()->create(['consultor_user_id' => $consultor->id])->id,
        ]);
        $foreign = CustomerCharge::factory()->draft()->create([
            'client_profile_id' => ClientProfile::factory()->create(['consultor_user_id' => User::factory()->consultor()->create()->id])->id,
        ]);

        $this->actingAs($consultor)->post(route('admin.financeiro.cobrancas.open-batch'), ['ids' => [$own->id, $foreign->id]]);

        expect($own->fresh()->status)->toBe('open')
            ->and($foreign->fresh()->status)->toBe('draft');
    });
});
