<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $isMySql = DB::connection()->getDriverName() === 'mysql';

        if ($isMySql) {
            $database = DB::getDatabaseName();

            $this->dropForeignIfExists('usina_solars', 'usina_solars_seller_id_foreign', $database);
            $this->dropForeignIfExists('usina_solars', 'usina_solars_user_id_foreign', $database);
        } else {
            // SQLite não permite remover colunas que fazem parte de uma foreign key
            // da própria tabela via DROP COLUMN; a constraint precisa ser removida antes
            // (o que dispara a reconstrução nativa da tabela para o driver sqlite).
            Schema::table('usina_solars', function (Blueprint $table) {
                if (Schema::hasColumn('usina_solars', 'user_id')) {
                    $table->dropForeign(['user_id']);
                }
                if (Schema::hasColumn('usina_solars', 'seller_id')) {
                    $table->dropForeign(['seller_id']);
                }
            });
        }

        Schema::table('usina_solars', function (Blueprint $table) {
            $columnsToDrop = [];
            foreach (['user_id', 'seller_id', 'taxa_reducao_consumo'] as $col) {
                if (Schema::hasColumn('usina_solars', $col)) {
                    $columnsToDrop[] = $col;
                }
            }
            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });

        Schema::table('usina_solars', function (Blueprint $table) {
            if (! Schema::hasColumn('usina_solars', 'usina_nome')) {
                $table->string('usina_nome')->nullable()->after('id');
            }

            if (! Schema::hasColumn('usina_solars', 'producer_profile_id')) {
                $table->foreignId('producer_profile_id')->nullable()->after('id')
                    ->constrained('producer_profiles')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            if (! Schema::hasColumn('usina_solars', 'seller_id')) {
                $table->unsignedBigInteger('seller_id')->nullable();
            }
            if (! Schema::hasColumn('usina_solars', 'taxa_reducao_consumo')) {
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
