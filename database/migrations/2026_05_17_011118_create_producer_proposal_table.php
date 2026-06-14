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
        Schema::create('producer_proposals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producer_profile_id')->constrained('producer_profiles')->cascadeOnDelete();
            $table->foreignId('consultor_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('concessionaria_id')->nullable()->constrained('concessionarias')->nullOnDelete();
            $table->foreignId('address_id')->nullable()->constrained('addresses')->nullOnDelete();

            $table->string('status')->default('emitida');
            $table->decimal('media_geracao', 12, 2)->nullable();
            $table->integer('prazo_contrato')->nullable();
            $table->decimal('potencia_usina', 12, 2)->nullable();
            $table->decimal('valor_investimento', 12, 2)->nullable();

            $table->date('issued_at');
            $table->date('valid_until')->nullable();
            $table->decimal('fill_percent', 8, 2)->nullable();
            $table->text('notes')->nullable();

            $table->index(['producer_profile_id', 'status']);
            $table->index(['consultor_user_id', 'status']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('producer_proposal');
    }
};
