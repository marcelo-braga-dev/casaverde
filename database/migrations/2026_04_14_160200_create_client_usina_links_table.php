<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_usina_links', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_profile_id')->constrained('client_profiles')->cascadeOnDelete();
            $table->foreignId('usina_id')->constrained('usina_solars')->cascadeOnDelete();

            $table->date('started_at');
            $table->date('ended_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['client_profile_id', 'is_active']);
            $table->index(['usina_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_usina_links');
    }
};