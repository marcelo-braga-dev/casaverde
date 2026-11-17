<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Admin\Dashboard\BillingQueueService;

it('counts each billing step that depends on someone acting', function () {
    $bill = fn () => ConcessionaireBill::factory()->approved()->create()->id;
    ConcessionaireBill::factory()->count(2)->create(['review_status' => 'pending_review']);
    ConcessionaireBill::factory()->approved()->create();
    CustomerCharge::factory()->draft()->create(['final_amount' => 100, 'concessionaire_bill_id' => $bill()]);
    $withSlip = CustomerCharge::factory()->open()->create(['final_amount' => 50, 'concessionaire_bill_id' => $bill()]);
    PaymentSlip::factory()->create(['customer_charge_id' => $withSlip->id, 'status' => 'generated']);
    CustomerCharge::factory()->create(['status' => 'overdue', 'final_amount' => 70, 'concessionaire_bill_id' => $bill()]);

    $steps = collect(app(BillingQueueService::class)->handle())->keyBy('key');

    expect($steps['bills_pending_review']['count'])->toBe(2)
        ->and($steps['charges_draft']['count'])->toBe(1)
        ->and($steps['charges_draft']['amount'])->toBe(100.0)
        ->and($steps['charges_without_payment']['count'])->toBe(1)
        ->and($steps['charges_without_payment']['amount'])->toBe(70.0)
        ->and($steps['charges_overdue']['count'])->toBe(1);
});

it('shows the billing queue on the admin dashboard', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('billingQueue', 4));
});

it('lists the whole review queue regardless of period when filtering pending bills', function () {
    $this->actingAs(User::factory()->admin()->create());
    ConcessionaireBill::factory()->create(['review_status' => 'pending_review', 'created_at' => now()->subMonths(2)]);
    ConcessionaireBill::factory()->create(['review_status' => 'pending_review']);

    $all = $this->get(route('admin.relatorios.faturas', ['review_status' => 'pending_review']))
        ->viewData('page')['props']['report'];
    $month = $this->get(route('admin.relatorios.faturas'))->viewData('page')['props']['report'];

    expect($all['summary']['total'])->toBe(2)
        ->and($all['summary']['whole_queue'])->toBeTrue()
        ->and($month['summary']['total'])->toBe(1)
        ->and($month['summary']['pending_queue_total'])->toBe(2);
});
