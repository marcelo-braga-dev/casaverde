<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Usina\UsinaSolar;
use App\Services\Admin\Dashboard\AdminDashboardService;

describe('AdminDashboardService', function () {

    beforeEach(function () {
        $this->service = app(AdminDashboardService::class);
    });

    it('returns summary with zero metrics when database is empty', function () {
        $data = $this->service->handle();

        expect($data['summary']['clients_total'])->toBe(0)
            ->and($data['summary']['plants_total'])->toBe(0)
            ->and($data['summary']['bills_pending_review'])->toBe(0)
            ->and((float) $data['summary']['charges_open_amount'])->toBe(0.0)
            ->and((float) $data['summary']['charges_overdue_amount'])->toBe(0.0);
    });

    it('counts total clients correctly', function () {
        ClientProfile::factory()->count(3)->create();

        $data = $this->service->handle();

        expect($data['summary']['clients_total'])->toBe(3);
    });

    it('counts active clients by is_active_client or contrato_assinado status', function () {
        ClientProfile::factory()->create(['is_active_client' => true]);
        ClientProfile::factory()->create(['status' => 'contrato_assinado']);
        ClientProfile::factory()->create(['status' => 'prospect']);

        $data = $this->service->handle();

        expect($data['summary']['clients_active'])->toBe(2);
    });

    it('counts total usinas correctly', function () {
        UsinaSolar::factory()->count(4)->create();

        $data = $this->service->handle();

        expect($data['summary']['plants_total'])->toBe(4);
    });

    it('counts pending review bills correctly', function () {
        ConcessionaireBill::factory()->create(['review_status' => 'pending_review']);
        ConcessionaireBill::factory()->create(['review_status' => 'pending_review']);
        ConcessionaireBill::factory()->approved()->create();

        $data = $this->service->handle();

        expect($data['summary']['bills_pending_review'])->toBe(2);
    });

    it('sums charges_open_amount from open and waiting_payment status', function () {
        CustomerCharge::factory()->create(['status' => 'open', 'final_amount' => 100.0]);
        CustomerCharge::factory()->create(['status' => 'waiting_payment', 'final_amount' => 50.0]);
        CustomerCharge::factory()->paid()->create(['final_amount' => 999.0]);

        $data = $this->service->handle();

        expect((float) $data['summary']['charges_open_amount'])->toBe(150.0);
    });

    it('sums charges_overdue_amount from overdue status', function () {
        CustomerCharge::factory()->overdue()->create(['final_amount' => 75.0]);
        CustomerCharge::factory()->overdue()->create(['final_amount' => 25.0]);
        CustomerCharge::factory()->open()->create(['final_amount' => 999.0]);

        $data = $this->service->handle();

        expect((float) $data['summary']['charges_overdue_amount'])->toBe(100.0);
    });

    it('returns 6 quick report links', function () {
        $data = $this->service->handle();

        expect($data['quickReports'])->toHaveCount(6);
    });

    it('quick report items have title, description and route keys', function () {
        $data = $this->service->handle();

        foreach ($data['quickReports'] as $report) {
            expect($report)->toHaveKey('title')
                ->toHaveKey('description')
                ->toHaveKey('route');
        }
    });
});
