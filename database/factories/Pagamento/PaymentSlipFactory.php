<?php

namespace Database\Factories\Pagamento;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentSlipFactory extends Factory
{
    protected $model = PaymentSlip::class;

    public function definition(): array
    {
        return [
            'customer_charge_id' => CustomerCharge::factory(),
            'payment_provider_account_id' => PaymentProviderAccount::factory(),
            'provider' => 'cora',
            'provider_payment_id' => 'inv-'.fake()->unique()->numerify('########'),
            'provider_status' => 'OPEN',
            'payment_method' => 'boleto_pix',
            'status' => 'generated',
            'amount' => 250.00,
            'due_date' => now()->addDays(15)->toDateString(),
            'barcode' => null,
            'digitable_line' => null,
            'pix_qr_code' => null,
            'pix_copy_paste' => null,
            'checkout_url' => null,
            'pdf_url' => null,
            'request_payload' => null,
            'response_payload' => null,
            'generated_at' => now(),
            'paid_at' => null,
            'cancelled_at' => null,
            'error_message' => null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn () => ['status' => 'paid', 'paid_at' => now()]);
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }
}
