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
        Schema::create('produtor_contratos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('autor_id')->constrained('users');
            $table->foreignId('produtor_id')->constrained('users');
            $table->string('admin_nome');
            $table->string('admin_qualificacao')->nullable();
            $table->foreignId('admin_endereco_id')->constrained('enderecos');
            $table->string('usina_nome');
            $table->foreignId('usina_endereco_id')->constrained('enderecos');
            $table->bigInteger('usina_cnpj');
            $table->decimal('potencia_kw');
            $table->decimal('potencia_kwp');
            $table->bigInteger('geracao_anual');
            $table->bigInteger('unidade_consumidora');
            $table->decimal('usina_area');
            $table->decimal('imovel_area');
            $table->decimal('imovel_matricula');
            $table->string('tipo_area');
            $table->string('classificacao');
            $table->string('prazo_locacao');
            $table->text('modulos');
            $table->text('inversores');
            $table->text('descricao')->nullable();
            $table->decimal('parcela_fixa');
            $table->decimal('taxa_administracao');
            $table->date('contrato_data');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produtor_contratos');
    }
};
