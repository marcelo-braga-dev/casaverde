<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $table->foreignId('consultor_user_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
            $table->foreignId('concessionaria_id')->nullable()->after('consultor_user_id')->constrained('concessionarias')->nullOnDelete();
            $table->foreignId('address_id')->nullable()->after('usina_block_id')->constrained('addresses')->nullOnDelete();

            $table->string('uc')->nullable()->after('status');
            $table->decimal('media_geracao', 12, 2)->nullable();
            $table->integer('prazo_locacao')->nullable();
            $table->decimal('potencia_usina', 12, 2)->nullable();
            $table->decimal('taxa_comissao', 8, 2)->nullable();
            $table->text('inversores')->nullable();
            $table->text('modulos')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $table->dropConstrainedForeignId('consultor_user_id');
            $table->dropConstrainedForeignId('concessionaria_id');
            $table->dropConstrainedForeignId('address_id');

            $table->dropColumn([
                'uc',
                'media_geracao',
                'prazo_locacao',
                'potencia_usina',
                'taxa_comissao',
                'inversores',
                'modulos',
            ]);
        });
    }
};