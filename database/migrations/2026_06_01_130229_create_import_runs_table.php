<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_runs', function (Blueprint $table) {
            $table->id();

            // Identificação
            $table->string('run_code', 30)->unique()->comment('Código único ex: RUN-20260601-143022');
            $table->enum('triggered_by', ['scheduler', 'manual', 'command'])->default('scheduler');
            $table->foreignId('triggered_by_user_id')->nullable()->constrained('users')->nullOnDelete();

            // Escopo — se null, processou todos os clientes ativos
            $table->foreignId('client_profile_id')->nullable()->constrained('client_profiles')->nullOnDelete();

            // Status da execução
            $table->enum('status', ['running', 'completed', 'failed', 'partial'])->default('running');

            // Métricas
            $table->unsignedInteger('total_settings')->default(0)->comment('Configurações processadas');
            $table->unsignedInteger('total_processed')->default(0)->comment('Emails processados');
            $table->unsignedInteger('total_imported')->default(0)->comment('Faturas importadas com sucesso');
            $table->unsignedInteger('total_skipped')->default(0)->comment('Emails já importados anteriormente');
            $table->unsignedInteger('total_failed')->default(0)->comment('Emails com falha');

            // Timing
            $table->timestamp('started_at');
            $table->timestamp('finished_at')->nullable();
            $table->unsignedInteger('duration_ms')->nullable()->comment('Duração em milissegundos');

            // Erro fatal (se o run todo falhou)
            $table->text('error_message')->nullable();

            $table->timestamps();

            $table->index(['status', 'started_at']);
            $table->index('client_profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('import_runs');
    }
};
