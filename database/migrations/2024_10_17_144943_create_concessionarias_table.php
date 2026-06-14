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
        Schema::create('concessionarias', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->decimal('tarifa_gd2')->default(0);
            $table->string('estado', 2);
            $table->timestamps();
        });

        Schema::table('usina_solars', function (Blueprint $table) {
            $table->foreign('concessionaria_id')->references('id')->on('concessionarias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('concessionarias');
    }
};
