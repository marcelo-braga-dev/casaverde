<?php

use App\Models\WhatsApp\WhatsAppMessageTemplate;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    // Migration (e não só seeder): o seeder usa updateOrCreate e sobrescreveria os
    // templates que já foram personalizados em produção.
    public function up(): void
    {
        WhatsAppMessageTemplate::query()->firstOrCreate(
            ['key' => 'enviar_boleto'],
            [
                'name' => 'Envio de boleto / novo boleto',
                'category' => 'Financeiro',
                'message' => "Olá {{cliente_nome}}! 🧾 Segue o boleto da sua fatura de {{mes_referencia}}, no valor de {{valor_fatura}}, com vencimento em {{data_vencimento}}.\n\n{{dados_pagamento}}\n\nQualquer dúvida, é só chamar!",
                'available_variables' => ['cliente_nome', 'mes_referencia', 'valor_fatura', 'data_vencimento', 'dados_pagamento'],
                'is_active' => true,
            ],
        );
    }

    public function down(): void
    {
        WhatsAppMessageTemplate::query()->where('key', 'enviar_boleto')->delete();
    }
};
