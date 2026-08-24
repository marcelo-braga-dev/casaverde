<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Uma fatura cancelada não podia mais gerar cobrança nenhuma: a unique key
     * `uk_charge_bill` amarrava a fatura à cobrança cancelada para sempre, mesmo
     * depois de corrigir a checagem de duplicidade em GenerateCustomerChargeFromBillService.
     * Passa a permitir múltiplas linhas em customer_charges por concessionaire_bill_id
     * (histórico de cobranças canceladas + a atual); "no máximo uma cobrança ATIVA por
     * fatura" passa a ser regra de aplicação (mesmo padrão já usado para pagamentos
     * ativos em PaymentSlip), não mais constraint de banco.
     */
    public function up(): void
    {
        Schema::table('customer_charges', function (Blueprint $table) {
            $table->index('concessionaire_bill_id', 'idx_customer_charges_concessionaire_bill_id');
        });

        Schema::table('customer_charges', function (Blueprint $table) {
            $table->dropUnique('uk_charge_bill');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_charges', function (Blueprint $table) {
            $table->dropIndex('idx_customer_charges_concessionaire_bill_id');
        });

        Schema::table('customer_charges', function (Blueprint $table) {
            $table->unique('concessionaire_bill_id', 'uk_charge_bill');
        });
    }
};
