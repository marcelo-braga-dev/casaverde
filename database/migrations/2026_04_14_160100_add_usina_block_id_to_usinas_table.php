<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $table->foreignId('usina_block_id')
                ->nullable()
                ->after('id')
                ->constrained('usina_blocks')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $table->dropConstrainedForeignId('usina_block_id');
        });
    }
};