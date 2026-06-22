<?php

namespace Database\Factories\Pagamento;

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentProviderAccountFactory extends Factory
{
    protected $model = PaymentProviderAccount::class;

    public function definition(): array
    {
        return [
            'provider' => 'cora',
            'name' => 'Cora Sandbox',
            'is_active' => true,
            'is_default' => true,
            'environment' => 'sandbox',
            'base_url' => 'https://matls-clients.api.stage.cora.com.br',
            'client_id' => 'client-id-'.fake()->uuid(),
            'client_secret' => 'client-secret-'.fake()->uuid(),
            'webhook_secret' => null,
            'settings' => null,
        ];
    }

    public function withWebhookSecret(string $secret = 'test-webhook-secret'): static
    {
        return $this->state(fn () => ['webhook_secret' => $secret]);
    }
}
