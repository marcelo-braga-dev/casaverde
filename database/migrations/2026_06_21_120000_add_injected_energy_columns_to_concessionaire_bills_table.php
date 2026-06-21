<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            $table->decimal('injected_energy_kwh', 12, 2)->nullable()->after('consumo_kwh');
            $table->decimal('injected_energy_amount', 12, 2)->nullable()->after('injected_energy_kwh');
            $table->decimal('injected_consumption_kwh', 12, 2)->nullable()->after('injected_energy_amount');
            $table->decimal('injected_consumption_amount', 12, 2)->nullable()->after('injected_consumption_kwh');
            $table->decimal('injected_consumption_discount_percent', 5, 2)->nullable()->after('injected_consumption_amount');
        });
    }

    public function down(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            $table->dropColumn([
                'injected_energy_kwh',
                'injected_energy_amount',
                'injected_consumption_kwh',
                'injected_consumption_amount',
                'injected_consumption_discount_percent',
            ]);
        });
    }
};
