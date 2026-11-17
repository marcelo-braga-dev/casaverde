<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;

it('reopens by due date after the payment ends, and never touches a final charge', function () {
    $late = CustomerCharge::factory()->create(['status' => 'overdue', 'due_date' => now()->subDays(3)->toDateString()]);
    $onTime = CustomerCharge::factory()->create(['status' => 'overdue', 'due_date' => now()->addDays(3)->toDateString()]);
    $paid = CustomerCharge::factory()->paid()->create();
    $cancelled = CustomerCharge::factory()->cancelled()->create();

    expect($late->reopenAfterPaymentEnded())->toBeTrue()
        ->and($late->fresh()->status)->toBe('overdue')
        ->and($onTime->reopenAfterPaymentEnded())->toBeTrue()
        ->and($onTime->fresh()->status)->toBe('open')
        ->and($paid->reopenAfterPaymentEnded())->toBeFalse()
        ->and($paid->fresh()->status)->toBe('paid')
        ->and($cancelled->reopenAfterPaymentEnded())->toBeFalse()
        ->and($cancelled->fresh()->status)->toBe('cancelled');
});

it('treats only pending and generated slips as active', function () {
    $charge = CustomerCharge::factory()->open()->create();

    foreach (['pending', 'generated', 'expired', 'cancelled', 'failed', 'paid'] as $status) {
        PaymentSlip::factory()->create(['customer_charge_id' => $charge->id, 'status' => $status]);
    }

    expect(PaymentSlip::query()->active()->pluck('status')->sort()->values()->all())->toBe(['generated', 'pending'])
        ->and($charge->hasActivePayment())->toBeTrue();
});
