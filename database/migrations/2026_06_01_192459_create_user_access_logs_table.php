<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_access_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->string('event')->default('login')
                ->comment('login | logout | blocked | unblocked | password_changed | access_created');

            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('country', 60)->nullable();
            $table->string('city', 60)->nullable();

            // Para eventos de bloqueio/desbloqueio: quem executou a ação
            $table->foreignId('performed_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('notes')->nullable()->comment('Observações adicionais do evento');

            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'event']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_access_logs');
    }
};
