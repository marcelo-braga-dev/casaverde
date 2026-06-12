<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $isMySql = DB::connection()->getDriverName() === 'mysql';

        // Remove a foreign key somente se existir (consulta específica do MySQL)
        if ($isMySql) {
            $foreignKey = DB::select("
                SELECT CONSTRAINT_NAME
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'produtor_propostas'
                AND COLUMN_NAME = 'concessionaria_id'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ");

            if (!empty($foreignKey)) {

                $constraintName = $foreignKey[0]->CONSTRAINT_NAME;

                DB::statement("
                    ALTER TABLE produtor_propostas
                    DROP FOREIGN KEY {$constraintName}
                ");
            }
        }

        Schema::table('produtor_propostas', function (Blueprint $table) use ($isMySql) {

            if (
                Schema::hasColumn('produtor_propostas', 'geracao') &&
                !Schema::hasColumn('produtor_propostas', 'geracao_media')
            ) {
                $table->renameColumn('geracao', 'geracao_media');
            }

            if (
                Schema::hasColumn('produtor_propostas', 'valor') &&
                !Schema::hasColumn('produtor_propostas', 'valor_investimento')
            ) {
                $table->renameColumn('valor', 'valor_investimento');
            }

            if (Schema::hasColumn('produtor_propostas', 'potencia_ac')) {
                $table->dropColumn('potencia_ac');
            }

            // SQLite não permite dropar uma coluna que faz parte de uma foreign key
            // da própria tabela sem recriá-la; a FK já foi removida acima no MySQL.
            if ($isMySql && Schema::hasColumn('produtor_propostas', 'concessionaria_id')) {
                $table->dropColumn('concessionaria_id');
            }
        });

        Schema::table('produtor_propostas', function (Blueprint $table) {

//            $table->foreignId('consultor_id')
//                ->after('produtor_id')
//                ->constrained('users')
//                ->cascadeOnDelete();

//            $table->decimal('taxa_reducao', 8, 2)
//                ->nullable()
//                ->after('potencia');

//            $table->integer('prazo_locacao')
//                ->nullable()
//                ->after('taxa_reducao');
        });
    }

    public function down(): void
    {
        //
    }
};
