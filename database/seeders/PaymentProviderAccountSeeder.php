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

        PaymentProviderAccount::updateOrCreate(
            [
                'provider' => 'mercado_pago',
                'name' => 'Mercado Pago Principal',
            ],
            [
                'is_active' => true,
                'is_default' => true,
                'environment' => env('MERCADOPAGO_ENVIRONMENT', 'sandbox'),
                'base_url' => env('MERCADOPAGO_BASE_URL', 'https://api.mercadopago.com'),
                'client_id' => env('MERCADOPAGO_PUBLIC_KEY'),
                'client_secret' => env('MERCADOPAGO_ACCESS_TOKEN'),
                'webhook_secret' => env('MERCADOPAGO_WEBHOOK_SECRET'),
                'settings' => [],
            ]
        );
    }
}
