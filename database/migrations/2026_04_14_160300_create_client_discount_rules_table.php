<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_discount_rules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_profile_id')->constrained('client_profiles')->cascadeOnDelete();

            $table->decimal('discount_percent', 8, 2)->default(0);
            $table->dateTime('starts_on');
            $table->dateTime('ends_on')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['client_profile_id', 'is_active']);
            $table->index(['client_profile_id', 'starts_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_discount_rules');
    }
};
