<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('producer_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('admin_nome')->nullable();
            $table->string('admin_qualificacao')->nullable();
            $table->foreignId('admin_address_id')->nullable()->constrained('addresses')->nullOnDelete();

            $table->string('usina_nome')->nullable();
            $table->foreignId('usina_address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->string('usina_cnpj', 14)->nullable();

            $table->decimal('potencia_kw', 12, 2)->nullable();
            $table->decimal('potencia_kwp', 12, 2)->nullable();
            $table->decimal('geracao_anual', 12, 2)->nullable();

            $table->string('unidade_consumidora')->nullable();
            $table->decimal('usina_area', 12, 2)->nullable();
            $table->decimal('imovel_area', 12, 2)->nullable();
            $table->string('imovel_matricula')->nullable();
            $table->string('tipo_area')->nullable();
            $table->string('classificacao')->nullable();

            $table->integer('prazo_locacao')->nullable();
            $table->text('modulos')->nullable();
            $table->text('inversores')->nullable();
            $table->text('descricao')->nullable();

            $table->decimal('parcela_fixa', 12, 2)->nullable();
            $table->decimal('taxa_administracao', 8, 2)->nullable();
            $table->date('contrato_data')->nullable();

            $table->string('status')->default('lead');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('producer_profiles');
    }
};