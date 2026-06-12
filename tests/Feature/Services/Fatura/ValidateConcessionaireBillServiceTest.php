<?php

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ConcessionaireBillIssue;
use App\Models\Usina\UsinaSolar;
use App\Services\Fatura\ValidateConcessionaireBillService;

describe('ValidateConcessionaireBillService', function () {

    beforeEach(function () {
        $this->service = app(ValidateConcessionaireBillService::class);
    });

    it('flags missing_consumer_unit when the bill is not linked to a consumer unit', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => null,
        ]);

        $issues = collect($this->service->handle($bill))->pluck('issue_code');

        expect($issues)->toContain('missing_consumer_unit');
    });

    it('does not flag missing_consumer_unit or missing_active_usina when the uc has an active usina link', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $unit = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);
        $usina = UsinaSolar::factory()->create();

        ClientUsinaLink::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unit->id,
            'usina_id' => $usina->id,
        ]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unit->id,
            'usina_id' => $usina->id,
        ]);

        $issues = collect($this->service->handle($bill))->pluck('issue_code');

        expect($issues)->not->toContain('missing_consumer_unit')
            ->and($issues)->not->toContain('missing_active_usina');
    });

    it('flags missing_active_usina when the consumer unit has no active usina link', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $unit = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unit->id,
        ]);

        $issues = collect($this->service->handle($bill))->pluck('issue_code');

        expect($issues)->toContain('missing_active_usina');
    });

    it('flags duplicate_reference for two bills of the same consumer unit and reference label', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $unit = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);

        ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unit->id,
            'reference_label' => '05/2026',
        ]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unit->id,
            'reference_label' => '05/2026',
        ]);

        $issues = collect($this->service->handle($bill))->pluck('issue_code');

        expect($issues)->toContain('duplicate_reference');
    });

    it('does not flag duplicate_reference for bills of different consumer units with the same reference label', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $unitA = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);
        $unitB = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);

        ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unitA->id,
            'reference_label' => '05/2026',
        ]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unitB->id,
            'reference_label' => '05/2026',
        ]);

        $issues = collect($this->service->handle($bill))->pluck('issue_code');

        expect($issues)->not->toContain('duplicate_reference');
    });

    it('flags unit_mismatch when the bill usina differs from the consumer unit active usina link', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);
        $unit = ConsumerUnit::factory()->create(['client_profile_id' => $client->id]);
        $linkedUsina = UsinaSolar::factory()->create();
        $otherUsina = UsinaSolar::factory()->create();

        ClientUsinaLink::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unit->id,
            'usina_id' => $linkedUsina->id,
        ]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => $unit->id,
            'usina_id' => $otherUsina->id,
        ]);

        $issues = collect($this->service->handle($bill))->pluck('issue_code');

        expect($issues)->toContain('unit_mismatch');
    });

    it('persists generated issues to the database', function () {
        $client = ClientProfile::factory()->active()->create();
        ClientDiscountRule::factory()->create(['client_profile_id' => $client->id]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'consumer_unit_id' => null,
        ]);

        $this->service->handle($bill);

        expect(ConcessionaireBillIssue::query()
            ->where('concessionaire_bill_id', $bill->id)
            ->where('issue_code', 'missing_consumer_unit')
            ->exists())->toBeTrue();
    });
});
