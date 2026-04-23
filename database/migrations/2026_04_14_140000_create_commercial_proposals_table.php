<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commercial_proposals', function (Blueprint $table) {
            $table->id();
            $table->string('proposal_code')->unique();

            $table->foreignId('client_profile_id')->constrained('client_profiles')->cascadeOnDelete();
            $table->foreignId('consultor_user_id')->constrained('users')->cascadeOnDelete();

            $table->string('status')->default('emitida');
            $table->date('issued_at');
            $table->date('valid_until')->nullable();

            $table->decimal('estimated_monthly_value', 12, 2)->nullable();
            $table->decimal('discount_percent', 8, 2)->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['client_profile_id', 'status']);
            $table->index(['consultor_user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commercial_proposals');
    }
};