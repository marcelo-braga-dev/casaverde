<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_data', function (Blueprint $table) {
            $table->foreignId('address_id')->nullable()->after('user_id')->constrained('addresses')->nullOnDelete();

            $table->date('data_nascimento')->nullable()->change();
            $table->string('rg')->nullable()->change();
            $table->string('genero')->nullable()->change();
            $table->string('estado_civil')->nullable()->change();
            $table->string('profissao')->nullable()->change();
            $table->date('data_fundacao')->nullable()->change();
            $table->string('tipo_empresa')->nullable()->change();
            $table->string('ie')->nullable()->change();
            $table->string('im')->nullable()->change();
            $table->string('ramo_atividade')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('user_data', function (Blueprint $table) {
            $table->dropConstrainedForeignId('address_id');
        });
    }
};