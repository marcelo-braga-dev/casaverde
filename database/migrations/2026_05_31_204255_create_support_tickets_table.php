<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();

            // Identificação
            $table->string('ticket_code', 20)->unique();

            // Conteúdo
            $table->string('title');
            $table->text('description');
            $table->string('category')->default('outros');

            // Status e prioridade
            $table->string('status')->default('novo');
            $table->string('priority')->default('normal');

            // Relacionamentos de abertura
            $table->foreignId('opened_by_user_id')
                ->constrained('users')->cascadeOnDelete();

            // Vínculo com perfil (quem abriu — cliente ou produtor)
            $table->foreignId('client_profile_id')
                ->nullable()
                ->constrained('client_profiles')->nullOnDelete();

            $table->foreignId('producer_profile_id')
                ->nullable()
                ->constrained('producer_profiles')->nullOnDelete();

            // Consultor responsável (auto-detectado na abertura)
            $table->foreignId('consultor_user_id')
                ->nullable()
                ->constrained('users')->nullOnDelete();

            // Atendente designado
            $table->foreignId('assigned_to_user_id')
                ->nullable()
                ->constrained('users')->nullOnDelete();

            // Timestamps de ciclo de vida
            $table->timestamp('first_response_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();

            // Avaliação pós-fechamento
            $table->unsignedTinyInteger('rating')->nullable();
            $table->text('rating_comment')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Índices para queries comuns
            $table->index(['status', 'opened_by_user_id']);
            $table->index(['consultor_user_id', 'status']);
            $table->index(['assigned_to_user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
