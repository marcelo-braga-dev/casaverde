<?php

namespace Database\Factories\Cobranca;

use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerChargeFactory extends Factory
{
    protected $model = CustomerCharge::class;

    public function definition(): array
    {
        $original = 250.00;
        $discount = 15.00;
        $discountAmt = round($original * ($discount / 100), 2);

        return [
            'client_profile_id'       => ClientProfile::factory(),
            'platform_user_id'        => null,
            'usina_id'                => null,
            'concessionaria_id'       => null,
            'concessionaire_bill_id'  => null,
            'reference_month'         => now()->month,
            'reference_year'          => now()->year,
            'reference_label'         => now()->format('m/Y'),
            'due_date'                => now()->addDays(15)->toDateString(),
            'original_amount'         => $original,
            'discount_percent'        => $discount,
            'discount_amount'         => $discountAmt,
            'manual_discount_amount'  => 0,
            'manual_addition_amount'  => 0,
            'final_amount'            => $original - $discountAmt,
            'status'                  => 'draft',
            'generated_by_user_id'    => null,
            'approved_by_user_id'     => null,
            'approved_at'             => null,
            'paid_at'                 => null,
            'cancelled_at'            => null,
            'notes'                   => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['status' => 'draft']);
    }

    public function open(): static
    {
        return $this->state(fn () => ['status' => 'open', 'approved_at' => now()]);
    }

    public function paid(): static
    {
        return $this->state(fn () => ['status' => 'paid', 'paid_at' => now()]);
    }

    public function overdue(): static
    {
        return $this->state(fn () => ['status' => 'overdue']);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => ['status' => 'cancelled', 'cancelled_at' => now()]);
    }
}
