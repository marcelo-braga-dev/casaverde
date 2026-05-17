<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usina_generation_records', function (Blueprint $table) {
            $table->id();

            $table->foreignId('usina_id')
                ->constrained('usina_solars')
                ->cascadeOnDelete();

            $table->unsignedSmallInteger('reference_year');
            $table->unsignedTinyInteger('reference_month');

            $table->decimal('generated_energy_kwh', 14, 3)->default(0);
            $table->decimal('injected_energy_kwh', 14, 3)->default(0);
            $table->decimal('compensated_energy_kwh', 14, 3)->default(0);
            $table->decimal('available_energy_kwh', 14, 3)->default(0);

            $table->text('notes')->nullable();

            $table->foreignId('created_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->unique(
                ['usina_id', 'reference_year', 'reference_month'],
                'usina_generation_unique_period'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usina_generation_records');
    }
};
