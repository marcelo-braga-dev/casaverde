<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('producer_leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultor_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('producer_profile_id')->nullable()->constrained('producer_profiles')->nullOnDelete();
            $table->foreignId('concessionaria_id')->nullable()->constrained('concessionarias')->nullOnDelete();

            $table->decimal('taxa_reducao', 8, 2)->nullable();
            $table->integer('prazo_locacao')->nullable();
            $table->decimal('potencia', 12, 2)->nullable();

            $table->string('status')->default('lead');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('producer_leads');
    }
};