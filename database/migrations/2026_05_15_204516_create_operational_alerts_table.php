<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('operational_alerts', function (Blueprint $table) {
            $table->id();

            $table->string('module', 80)->index();
            $table->string('type', 120)->index();
            $table->string('severity', 30)->default('info')->index();

            $table->string('title');
            $table->text('message')->nullable();

            $table->nullableMorphs('alertable');

            $table->foreignId('usina_id')
                ->nullable()
                ->constrained('usina_solars')
                ->nullOnDelete();

            $table->foreignId('client_profile_id')
                ->nullable()
                ->constrained('client_profiles')
                ->nullOnDelete();

            $table->foreignId('assigned_to_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->unsignedSmallInteger('reference_year')->nullable();
            $table->unsignedTinyInteger('reference_month')->nullable();

            $table->string('status', 40)->default('open')->index();

            $table->json('payload')->nullable();

            $table->timestamp('detected_at')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->foreignId('resolved_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('resolution_notes')->nullable();

            $table->timestamps();

            $table->index(['usina_id', 'status']);
            $table->index(['client_profile_id', 'status']);
            $table->index(['reference_year', 'reference_month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operational_alerts');
    }
};
