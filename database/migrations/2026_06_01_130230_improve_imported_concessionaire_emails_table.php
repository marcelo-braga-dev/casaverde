<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('imported_concessionaire_emails', function (Blueprint $table) {

            // Rastreamento de execução
            $table->foreignId('import_run_id')
                ->nullable()
                ->after('client_email_import_setting_id')
                ->constrained('import_runs')
                ->nullOnDelete()
                ->comment('Execução de importação que gerou este registro');

            // Diagnóstico de falhas
            $table->string('step_failed', 50)
                ->nullable()
                ->after('error_message')
                ->comment('Etapa que falhou: fetch|unlock|extract|parse|store|validate');

            // Performance
            $table->unsignedInteger('duration_ms')
                ->nullable()
                ->after('step_failed')
                ->comment('Duração do processamento em ms');

            // Re-tentativas
            $table->unsignedTinyInteger('retry_count')
                ->default(0)
                ->after('duration_ms');

            $table->index('import_run_id');
            $table->index(['status', 'processed_at']);
        });
    }

    public function down(): void
    {
        Schema::table('imported_concessionaire_emails', function (Blueprint $table) {
            $table->dropForeign(['import_run_id']);
            $table->dropColumn(['import_run_id', 'step_failed', 'duration_ms', 'retry_count']);
        });
    }
};
