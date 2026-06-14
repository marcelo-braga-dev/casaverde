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
        Schema::create('produtor_propostas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('produtor_id');
            $table->unsignedBigInteger('concessionaria_id');
            $table->decimal('potencia', 10, 2);
            $table->integer('potencia_ac', false, true)->nullable();
            $table->decimal('geracao', 10, 2);
            $table->decimal('valor', 10, 2);
            $table->timestamps();

            $table->foreign('produtor_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('concessionaria_id')->references('id')->on('concessionarias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produtor_propostas');
    }
};
