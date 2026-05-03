<?php

namespace Database\Seeders;

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Database\Seeder;

class PaymentProviderAccountSeeder extends Seeder
{
    public function run(): void
    {
        PaymentProviderAccount::updateOrCreate(
            [
                'provider' => 'cora',
                'name' => 'Cora Principal',
            ],
            [
                'is_active' => true,
                'is_default' => true,
                'environment' => env('CORA_ENVIRONMENT', 'sandbox'),
                'base_url' => env('CORA_BASE_URL', 'https://api.stage.cora.com.br'),
                'client_id' => env('CORA_CLIENT_ID'),
                'client_secret' => env('CORA_CLIENT_SECRET'),
                'webhook_secret' => env('CORA_WEBHOOK_SECRET'),
                'settings' => [],
            ]
        );
    }
}
