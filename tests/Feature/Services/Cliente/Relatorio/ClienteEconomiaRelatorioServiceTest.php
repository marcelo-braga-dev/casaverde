<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Users\User;
use App\Services\Cliente\Relatorio\ClienteEconomiaRelatorioService;

describe('ClienteEconomiaRelatorioService', function () {

    beforeEach(function () {
        $this->service = app(ClienteEconomiaRelatorioService::class);
        $this->platformUser = User::factory()->cliente()->create();
        $this->client = ClientProfile::factory()->create(['platform_user_id' => $this->platformUser->id]);
    });

    it('uses the bill full value as "original_amount", not the charge base (consumo injetado)', function () {
        $bill = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $this->client->id,
            'reference_month' => 5,
            'reference_year' => 2026,
            'valor_total' => 796.17,
        ]);

        CustomerCharge::factory()->create([
            'client_profile_id' => $this->client->id,
            'concessionaire_bill_id' => $bill->id,
            'reference_month' => 5,
            'reference_year' => 2026,
            'status' => 'paid',
            'original_amount' => 1000.00,
            'discount_amount' => 200.00,
            'final_amount' => 800.00,
        ]);

        $report = $this->service->handle($this->platformUser->id, ['year' => 2026]);

        $may = collect($report['monthly'])->firstWhere('month', 5);

        expect($may['original_amount'])->toBe(796.17)
            ->and($may['final_amount'])->toBe(800.0);
    });

    it('uses the bill of the charge itself even when no separately-approved bill matches the month lookup', function () {
        // concessionaire_bill_id é obrigatório e único em customer_charges — a fatura
        // sempre existe, mas pode não estar "approved" (não aparecendo no lookup por mês).
        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $this->client->id,
            'review_status' => 'pending_review',
            'reference_month' => 6,
            'reference_year' => 2026,
            'valor_total' => 500.00,
        ]);

        CustomerCharge::factory()->create([
            'client_profile_id' => $this->client->id,
            'concessionaire_bill_id' => $bill->id,
            'reference_month' => 6,
            'reference_year' => 2026,
            'status' => 'open',
            'original_amount' => 999.00,
            'final_amount' => 400.00,
        ]);

        $report = $this->service->handle($this->platformUser->id, ['year' => 2026]);

        $june = collect($report['monthly'])->firstWhere('month', 6);

        expect($june['original_amount'])->toBe(999.0);
    });

    it('sums the bill full values into the monthly summary total_original_amount', function () {
        $billMay = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $this->client->id,
            'reference_month' => 5,
            'reference_year' => 2026,
            'valor_total' => 700.00,
        ]);
        CustomerCharge::factory()->create([
            'client_profile_id' => $this->client->id,
            'concessionaire_bill_id' => $billMay->id,
            'reference_month' => 5,
            'reference_year' => 2026,
            'status' => 'paid',
            'original_amount' => 900.00,
            'final_amount' => 600.00,
        ]);

        $billJune = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $this->client->id,
            'reference_month' => 6,
            'reference_year' => 2026,
            'valor_total' => 800.00,
        ]);
        CustomerCharge::factory()->create([
            'client_profile_id' => $this->client->id,
            'concessionaire_bill_id' => $billJune->id,
            'reference_month' => 6,
            'reference_year' => 2026,
            'status' => 'paid',
            'original_amount' => 950.00,
            'final_amount' => 650.00,
        ]);

        $report = $this->service->handle($this->platformUser->id, ['year' => 2026]);

        expect($report['summary']['total_original_amount'])->toBe(1500.0)
            ->and($report['summary']['total_final_amount'])->toBe(1250.0);
    });

    it('computes allTime totals using the bill full value via the join, not the charge base', function () {
        $bill = ConcessionaireBill::factory()->approved()->create([
            'client_profile_id' => $this->client->id,
            'valor_total' => 796.17,
        ]);

        CustomerCharge::factory()->create([
            'client_profile_id' => $this->client->id,
            'concessionaire_bill_id' => $bill->id,
            'status' => 'paid',
            'original_amount' => 1000.00,
            'discount_amount' => 200.00,
            'final_amount' => 800.00,
        ]);

        $report = $this->service->handle($this->platformUser->id);

        expect($report['allTime']['total_original'])->toBe(796.17)
            ->and($report['allTime']['total_final'])->toBe(800.0)
            ->and($report['allTime']['total_paid'])->toBe(800.0);
    });

});
