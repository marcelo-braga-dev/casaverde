<?php

namespace Database\Factories\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeHistory;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerChargeHistoryFactory extends Factory
{
    protected $model = CustomerChargeHistory::class;

    public function definition(): array
    {
        return [
            'customer_charge_id' => CustomerCharge::factory(),
            'user_id' => User::factory(),
            'action' => 'due_date_updated',
            'description' => 'Vencimento alterado de 10/08/2026 para 15/09/2026.',
        ];
    }
}
