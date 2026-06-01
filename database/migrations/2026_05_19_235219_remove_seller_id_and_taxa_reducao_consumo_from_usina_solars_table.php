<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $database = DB::getDatabaseName();

        $this->dropForeignIfExists('usina_solars', 'usina_solars_seller_id_foreign', $database);
        $this->dropForeignIfExists('usina_solars', 'usina_solars_user_id_foreign', $database);

        Schema::table('usina_solars', function (Blueprint $table) use ($database) {
            $columnsToDrop = [];
            foreach (['user_id', 'seller_id', 'taxa_reducao_consumo'] as $col) {
                if (Schema::hasColumn('usina_solars', $col)) {
                    $columnsToDrop[] = $col;
                }
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });

        Schema::table('usina_solars', function (Blueprint $table) {
            if (!Schema::hasColumn('usina_solars', 'usina_nome')) {
                $table->string('usina_nome')->nullable()->after('id');
            }

            if (!Schema::hasColumn('usina_solars', 'producer_profile_id')) {
                $table->foreignId('producer_profile_id')->nullable()->after('id')
                    ->constrained('producer_profiles')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            if (!Schema::hasColumn('usina_solars', 'seller_id')) {
                $table->unsignedBigInteger('seller_id')->nullable();
            }
            if (!Schema::hasColumn('usina_solars', 'taxa_reducao_consumo')) {
                $table->decimal('taxa_reducao_consumo', 10, 2)->nullable();
            }
        });
    }

    private function dropForeignIfExists(string $table, string $foreignKey, string $database): void
    {
        $exists = DB::table('information_schema.TABLE_CONSTRAINTS')
            ->where('TABLE_SCHEMA', $database)
            ->where('TABLE_NAME', $table)
            ->where('CONSTRAINT_NAME', $foreignKey)
            ->exists();

        if ($exists) {
            DB::statement("ALTER TABLE `{$table}` DROP FOREIGN KEY `{$foreignKey}`");
        }
    }
};
