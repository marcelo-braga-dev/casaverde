<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // StoreUsinaSolarRequest aceita esses campos vazios, mas as colunas eram NOT NULL:
    // cadastrar uma usina sem inversores, módulos ou média de geração dava erro 500.
    public function up(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $table->string('inversores', 1024)->nullable()->change();
            $table->string('modulos', 1024)->nullable()->change();
            $table->decimal('media_geracao', 8, 2)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $table->string('inversores', 1024)->nullable(false)->change();
            $table->string('modulos', 1024)->nullable(false)->change();
            $table->decimal('media_geracao', 8, 2)->nullable(false)->change();
        });
    }
};
