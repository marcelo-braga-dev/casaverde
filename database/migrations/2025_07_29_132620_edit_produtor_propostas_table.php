<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produtor_propostas', function (Blueprint $table) {
            $table->dropForeign(['concessionaria_id']);

            $table->renameColumn('geracao', 'geracao_media');
            $table->renameColumn('valor', 'valor_investimento');

            $table->dropColumn('potencia_ac');
            $table->dropColumn('concessionaria_id');
        });

        Schema::table('produtor_propostas', function (Blueprint $table) {
            $table->foreignId('consultor_id')
                ->after('produtor_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->decimal('taxa_reducao', 8, 2)
                ->nullable()
                ->after('potencia');

            $table->integer('prazo_locacao')
                ->nullable()
                ->after('taxa_reducao');
        });
    }

    public function down(): void
    {
        Schema::table('produtor_propostas', function (Blueprint $table) {
            $table->dropForeign(['consultor_id']);
            $table->dropColumn('consultor_id');
            $table->dropColumn('taxa_reducao');
            $table->dropColumn('prazo_locacao');
        });

        Schema::table('produtor_propostas', function (Blueprint $table) {
            $table->renameColumn('geracao_media', 'geracao');
            $table->renameColumn('valor_investimento', 'valor');

            $table->unsignedBigInteger('concessionaria_id')->nullable()->after('produtor_id');
            $table->integer('potencia_ac')->unsigned()->nullable()->after('potencia');

            $table->foreign('concessionaria_id')
                ->references('id')
                ->on('concessionarias')
                ->cascadeOnDelete();
        });
    }
};