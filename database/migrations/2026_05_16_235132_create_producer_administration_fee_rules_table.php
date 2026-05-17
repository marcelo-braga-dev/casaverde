<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('producer_administration_fee_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producer_profile_id')->constrained('producer_profiles')->cascadeOnDelete();

            $table->decimal('fee_percent', 8, 2)->default(0);
            $table->dateTime('starts_on');
            $table->dateTime('ends_on')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['producer_profile_id', 'is_active'], 'producer_profile_fee_id_is_active_index');
            $table->index(['producer_profile_id', 'starts_on'], 'producer_profile_fee_id_starts_on_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('producer_administration_fee_rules');
    }
};
