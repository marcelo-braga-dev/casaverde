<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            if (Schema::hasColumn('concessionaire_bills', 'concessionaria')) {
                $table->dropColumn('concessionaria');
            }

            if (! Schema::hasColumn('concessionaire_bills', 'concessionaria_id')) {
                $table->foreignId('concessionaria_id')
                    ->nullable()
                    ->after('import_source')
                    ->constrained('concessionarias')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            if (Schema::hasColumn('concessionaire_bills', 'concessionaria_id')) {
                $table->dropConstrainedForeignId('concessionaria_id');
            }

            if (! Schema::hasColumn('concessionaire_bills', 'concessionaria')) {
                $table->string('concessionaria')->default('copel')->after('import_source');
            }
        });
    }
};
