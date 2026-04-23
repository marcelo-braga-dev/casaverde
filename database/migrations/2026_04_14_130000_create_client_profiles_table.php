<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('client_code')->unique();

            $table->enum('tipo_pessoa', ['pf', 'pj']);
            $table->string('cpf', 11)->nullable()->unique();
            $table->string('cnpj', 14)->nullable()->unique();

            $table->string('nome')->nullable();
            $table->string('razao_social')->nullable();
            $table->string('nome_fantasia')->nullable();

            $table->string('cidade');
            $table->string('email')->nullable();
            $table->string('telefone')->nullable();

            $table->foreignId('consultor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('platform_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('status')->default('prospect');
            $table->boolean('is_active_client')->default(false);
            $table->timestamp('activated_at')->nullable();

            $table->timestamps();

            $table->index(['tipo_pessoa', 'status']);
            $table->index(['consultor_user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_profiles');
    }
};