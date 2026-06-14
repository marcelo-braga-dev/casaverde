<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consumer_units', function (Blueprint $table) {
            $table->decimal('consumo_previsto_kwh_mes', 10, 2)
                ->default(0)
                ->after('label')
                ->comment('Consumo médio mensal previsto (kWh), usado para dimensionar a alocação em usinas');
        });
    }

    public function down(): void
    {
        Schema::table('consumer_units', function (Blueprint $table) {
            $table->dropColumn('consumo_previsto_kwh_mes');
        });
    }
};
