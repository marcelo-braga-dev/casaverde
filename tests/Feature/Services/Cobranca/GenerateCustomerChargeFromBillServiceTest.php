<?php

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Users\User;
use App\Services\Cobranca\GenerateCustomerChargeFromBillService;

describe('GenerateCustomerChargeFromBillService', function () {

    beforeEach(function () {
        $this->service = app(GenerateCustomerChargeFromBillService::class);
        $this->admin   = User::factory()->admin()->create();
        $this->actingAs($this->admin);
    });

    it('generates a draft charge from an approved bill', function () {
        $client = ClientProfile::factory()->create();
        $bill   = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $client->id,
            'valor_total'       => 200.00,
        ]);

        $charge = $this->service->handle($bill);

        expect($charge)->toBeInstanceOf(CustomerCharge::class)
            ->and($charge->status)->toBe('draft')
            ->and($charge->client_profile_id)->toBe($client->id)
            ->and((float) $charge->original_amount)->toBe(200.00);
    });

    it('applies the clients active discount rule to calculate final amount', function () {
        $client = ClientProfile::factory()->create();

        ClientDiscountRule::factory()->create([
            'client_profile_id' => $client->id,
            'discount_percent'  => 20.0,
            'starts_on'         => now()->subDay(),
            'ends_on'           => null,
            'is_active'         => true,
        ]);

        $bill = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $client->id,
            'valor_total'       => 100.00,
        ]);

        $charge = $this->service->handle($bill);

        expect((float) $charge->discount_percent)->toBe(20.0)
            ->and((float) $charge->discount_amount)->toBe(20.0)
            ->and((float) $charge->final_amount)->toBe(80.0);
    });

    it('creates charge with zero discount when client has no active rule', function () {
        $client = ClientProfile::factory()->create();
        $bill   = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $client->id,
            'valor_total'       => 150.00,
        ]);

        $charge = $this->service->handle($bill);

        expect((float) $charge->discount_percent)->toBe(0.0)
            ->and((float) $charge->final_amount)->toBe(150.0);
    });

    it('throws InvalidArgumentException when bill is not approved', function () {
        $client = ClientProfile::factory()->create();
        $bill   = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'review_status'     => 'pending_review',
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('fatura aprovada');

        $this->service->handle($bill);
    });

    it('throws InvalidArgumentException when charge already exists for the bill', function () {
        $client = ClientProfile::factory()->create();
        $bill   = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $client->id,
            'valor_total'       => 100.00,
        ]);

        $this->service->handle($bill);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Já existe cobrança');

        $this->service->handle($bill);
    });

    it('sets manual_discount_amount and manual_addition_amount to zero', function () {
        $client = ClientProfile::factory()->create();
        $bill   = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $client->id,
            'valor_total'       => 80.00,
        ]);

        $charge = $this->service->handle($bill);

        expect((float) $charge->manual_discount_amount)->toBe(0.0)
            ->and((float) $charge->manual_addition_amount)->toBe(0.0);
    });

    it('links charge to the correct bill, client, and reference period', function () {
        $client = ClientProfile::factory()->create();
        $bill   = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $client->id,
            'valor_total'       => 100.00,
            'reference_month'   => 5,
            'reference_year'    => 2026,
            'reference_label'   => '05/2026',
        ]);

        $charge = $this->service->handle($bill);

        expect($charge->concessionaire_bill_id)->toBe($bill->id)
            ->and($charge->reference_month)->toBe(5)
            ->and($charge->reference_year)->toBe(2026)
            ->and($charge->reference_label)->toBe('05/2026');
    });

    it('sets generated_by_user_id to the authenticated user', function () {
        $client = ClientProfile::factory()->create();
        $bill   = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $client->id,
            'valor_total'       => 50.00,
        ]);

        $charge = $this->service->handle($bill);

        expect($charge->generated_by_user_id)->toBe($this->admin->id);
    });
});
