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
        Schema::create('usina_solars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('seller_id');
            $table->unsignedBigInteger('concessionaria_id');
            $table->string('status')->index();
            $table->decimal('taxa_comissao', 6, 3)->nullable();
            $table->unsignedBigInteger('uc')->nullable();
            $table->decimal('media_geracao', 8, 2);
            $table->integer('prazo_locacao')->nullable();
            $table->decimal('potencia_usina', 8, 3);
            $table->string('inversores', 1024);
            $table->string('modulos', 1024);

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('seller_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usina_solars');
    }
};
