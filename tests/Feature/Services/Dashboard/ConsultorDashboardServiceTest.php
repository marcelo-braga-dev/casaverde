<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;
use App\Services\Consultor\Dashboard\ConsultorDashboardService;

describe('ConsultorDashboardService', function () {

    beforeEach(function () {
        $this->service = app(ConsultorDashboardService::class);
        $this->consultor = User::factory()->consultor()->create();
        $this->other = User::factory()->consultor()->create();
    });

    it('returns zero metrics when consultor has no data', function () {
        $data = $this->service->handle($this->consultor->id);

        expect($data['summary']['clients_total'])->toBe(0)
            ->and($data['summary']['producers_total'])->toBe(0)
            ->and($data['summary']['usinas_total'])->toBe(0);
    });

    it('counts only clients belonging to the consultor', function () {
        ClientProfile::factory()->count(3)->create(['consultor_user_id' => $this->consultor->id]);
        ClientProfile::factory()->count(2)->create(['consultor_user_id' => $this->other->id]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['summary']['clients_total'])->toBe(3);
    });

    it('counts active clients for the consultor', function () {
        ClientProfile::factory()->active()->create(['consultor_user_id' => $this->consultor->id]);
        ClientProfile::factory()->prospect()->create(['consultor_user_id' => $this->consultor->id]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['summary']['clients_active'])->toBe(1);
    });

    it('counts usinas belonging to the consultor', function () {
        UsinaSolar::factory()->count(2)->create(['consultor_user_id' => $this->consultor->id]);
        UsinaSolar::factory()->create(['consultor_user_id' => $this->other->id]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['summary']['usinas_total'])->toBe(2);
    });

    it('counts producers belonging to the consultor', function () {
        ProducerProfile::factory()->count(2)->create(['consultor_user_id' => $this->consultor->id]);
        ProducerProfile::factory()->create(['consultor_user_id' => $this->other->id]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['summary']['producers_total'])->toBe(2);
    });

    it('counts open client proposals for the consultor', function () {
        $client = ClientProfile::factory()->create(['consultor_user_id' => $this->consultor->id]);

        CommercialProposal::factory()->emitida()->create([
            'consultor_user_id' => $this->consultor->id,
            'client_profile_id' => $client->id,
        ]);
        CommercialProposal::factory()->aprovada()->create([
            'consultor_user_id' => $this->consultor->id,
            'client_profile_id' => $client->id,
        ]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['summary']['client_proposals_open'])->toBe(1);
    });

    it('counts pending bills from consultor clients', function () {
        $client = ClientProfile::factory()->create(['consultor_user_id' => $this->consultor->id]);
        $other = ClientProfile::factory()->create(['consultor_user_id' => $this->other->id]);

        ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'review_status' => 'pending_review',
        ]);
        ConcessionaireBill::factory()->create([
            'client_profile_id' => $other->id,
            'review_status' => 'pending_review',
        ]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['summary']['bills_pending_review'])->toBe(1);
    });

    it('returns up to 6 recent clients', function () {
        ClientProfile::factory()->count(8)->create(['consultor_user_id' => $this->consultor->id]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['recentClients'])->toHaveCount(6);
    });

    it('returns recent clients only from consultor', function () {
        ClientProfile::factory()->count(2)->create(['consultor_user_id' => $this->consultor->id]);
        ClientProfile::factory()->count(3)->create(['consultor_user_id' => $this->other->id]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['recentClients'])->toHaveCount(2);
    });

    it('returns 4 quick actions', function () {
        $data = $this->service->handle($this->consultor->id);

        expect($data['quickActions'])->toHaveCount(4);
    });

    it('quick actions have title, description, route and icon keys', function () {
        $data = $this->service->handle($this->consultor->id);

        foreach ($data['quickActions'] as $action) {
            expect($action)->toHaveKey('title')
                ->toHaveKey('description')
                ->toHaveKey('route')
                ->toHaveKey('icon');
        }
    });

    it('counts clients created this month', function () {
        ClientProfile::factory()->create([
            'consultor_user_id' => $this->consultor->id,
            'created_at' => now(),
        ]);
        ClientProfile::factory()->create([
            'consultor_user_id' => $this->consultor->id,
            'created_at' => now()->subMonth(2),
        ]);

        $data = $this->service->handle($this->consultor->id);

        expect($data['summary']['clients_this_month'])->toBe(1);
    });
});
