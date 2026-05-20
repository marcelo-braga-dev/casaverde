<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {

            $table->dropForeign(
                'usina_solars_seller_id_foreign'
            );

            $table->dropForeign(
                'usina_solars_user_id_foreign'
            );

            $table->dropColumn([
                'user_id',
                'seller_id',
                'taxa_reducao_consumo',
            ]);

            $table->string('usina_nome')->after('id');

            $table->foreignId('producer_profile_id')->nullable()->after('usina_block_id')
                ->constrained('producer_profiles')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {

            $table->unsignedBigInteger('seller_id')
                ->nullable()
                ->after('user_id');

            $table->decimal(
                'taxa_reducao_consumo',
                10,
                2
            )->nullable();

            $table->foreign('seller_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }
};
