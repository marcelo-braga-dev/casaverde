<?php

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Usina\Concessionaria;
use App\Services\Fatura\ReviewConcessionaireBillService;

describe('ReviewConcessionaireBillService', function () {

    beforeEach(function () {
        $this->service = app(ReviewConcessionaireBillService::class);
    });

    it('persists manually edited injected energy and consumption values', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $concessionaria = Concessionaria::factory()->create();

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'injected_energy_kwh' => -2034.00,
            'injected_energy_amount' => -560.86,
            'injected_consumption_kwh' => -5031.74,
            'injected_consumption_amount' => -1147.91,
        ]);

        $updated = $this->service->handle($bill, [
            'concessionaria_id' => $concessionaria->id,
            'reference_month' => $bill->reference_month,
            'reference_year' => $bill->reference_year,
            'unidade_consumidora' => $bill->unidade_consumidora,
            'vencimento' => $bill->vencimento->toDateString(),
            'valor_total' => '796.17',
            'consumo_kwh' => '2716',
            'injected_energy_kwh' => '1500.00',
            'injected_energy_amount' => '400.00',
            'injected_consumption_kwh' => '3000.00',
            'injected_consumption_amount' => '700.00',
            'review_status' => 'reviewed',
        ]);

        expect((float) $updated->injected_energy_kwh)->toBe(1500.0)
            ->and((float) $updated->injected_energy_amount)->toBe(400.0)
            ->and((float) $updated->injected_consumption_kwh)->toBe(3000.0)
            ->and((float) $updated->injected_consumption_amount)->toBe(700.0);
    });

    it('clears injected values when an empty value is submitted', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $concessionaria = Concessionaria::factory()->create();

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'injected_energy_kwh' => -2034.00,
        ]);

        $updated = $this->service->handle($bill, [
            'concessionaria_id' => $concessionaria->id,
            'reference_month' => $bill->reference_month,
            'reference_year' => $bill->reference_year,
            'unidade_consumidora' => $bill->unidade_consumidora,
            'vencimento' => $bill->vencimento->toDateString(),
            'valor_total' => '796.17',
            'injected_energy_kwh' => '',
            'review_status' => 'reviewed',
        ]);

        expect($updated->injected_energy_kwh)->toBeNull();
    });

    it('persists a manually edited discount percent', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $concessionaria = Concessionaria::factory()->create();

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'injected_consumption_discount_percent' => 20.00,
        ]);

        $updated = $this->service->handle($bill, [
            'concessionaria_id' => $concessionaria->id,
            'reference_month' => $bill->reference_month,
            'reference_year' => $bill->reference_year,
            'unidade_consumidora' => $bill->unidade_consumidora,
            'vencimento' => $bill->vencimento->toDateString(),
            'valor_total' => '796.17',
            'injected_consumption_discount_percent' => '35,5',
            'review_status' => 'reviewed',
        ]);

        expect((float) $updated->injected_consumption_discount_percent)->toBe(35.5);
    });

    it('clamps the discount percent between 0 and 100', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $concessionaria = Concessionaria::factory()->create();

        $bill = ConcessionaireBill::factory()->create(['client_profile_id' => $client->id]);

        $updated = $this->service->handle($bill, [
            'concessionaria_id' => $concessionaria->id,
            'reference_month' => $bill->reference_month,
            'reference_year' => $bill->reference_year,
            'unidade_consumidora' => $bill->unidade_consumidora,
            'vencimento' => $bill->vencimento->toDateString(),
            'valor_total' => '796.17',
            'injected_consumption_discount_percent' => '150',
            'review_status' => 'reviewed',
        ]);

        expect((float) $updated->injected_consumption_discount_percent)->toBe(100.0);
    });

});
