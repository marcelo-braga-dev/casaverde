<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commercial_proposals', function (Blueprint $table) {
            $table->foreignId('concessionaria_id')->nullable()->after('consultor_user_id')->constrained('concessionarias')->nullOnDelete();

            $table->decimal('media_consumo', 12, 2)->nullable();
            $table->decimal('taxa_reducao', 8, 2)->nullable();
            $table->integer('prazo_locacao')->nullable();
            $table->decimal('valor_medio', 12, 2)->nullable();
            $table->string('unidade_consumidora')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('commercial_proposals', function (Blueprint $table) {
            $table->dropConstrainedForeignId('concessionaria_id');

            $table->dropColumn([
                'media_consumo',
                'taxa_reducao',
                'prazo_locacao',
                'valor_medio',
                'unidade_consumidora',
            ]);
        });
    }
};