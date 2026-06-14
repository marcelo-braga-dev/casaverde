<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->enum('tipo_pessoa', ['pf', 'pj'])->default('pj');
            $table->string('nome')->nullable();
            $table->string('razao_social')->nullable();
            $table->string('nome_fantasia')->nullable();
            $table->bigInteger('cnpj')->nullable()->unique();
            $table->bigInteger('cpf')->nullable()->unique();
            $table->string('rg')->nullable();
            $table->string('ie')->nullable();
            $table->string('im')->nullable();
            $table->date('data_nascimento')->nullable();
            $table->date('data_fundacao')->nullable();
            $table->enum('genero', ['m', 'f'])->nullable();
            $table->string('estado_civil')->nullable();
            $table->string('profissao')->nullable();
            $table->string('tipo_empresa')->nullable();
            $table->string('ramo_atividade')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_data');
    }
};
