<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_usina_links', function (Blueprint $table) {
            $table->decimal('consumption_percentage', 5, 2)
                ->default(100)
                ->after('discount_percentage')
                ->comment('Percentual do consumo previsto da UC alocado a esta usina');
        });
    }

    public function down(): void
    {
        Schema::table('client_usina_links', function (Blueprint $table) {
            $table->dropColumn('consumption_percentage');
        });
    }
};
