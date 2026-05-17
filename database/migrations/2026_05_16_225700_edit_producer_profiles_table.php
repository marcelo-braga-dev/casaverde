<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('producer_profiles', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | REMOVER FOREIGN KEYS
            |--------------------------------------------------------------------------
            */
            Schema::table('producer_profiles', function (Blueprint $table) {

                $this->dropForeignIfExists(
                    'producer_profiles',
                    'producer_profiles_user_id_foreign'
                );

                $this->dropForeignIfExists(
                    'producer_profiles',
                    'producer_profiles_created_by_user_id_foreign'
                );

                $this->dropForeignIfExists(
                    'producer_profiles',
                    'producer_profiles_admin_address_id_foreign'
                );

                $this->dropForeignIfExists(
                    'producer_profiles',
                    'producer_profiles_usina_address_id_foreign'
                );
            });
//            if (Schema::hasColumn('producer_profiles', 'user_id')) {
//                $table->dropForeign(['user_id']);
//            }
//
//            if (Schema::hasColumn('producer_profiles', 'created_by_user_id')) {
//                $table->dropForeign(['created_by_user_id']);
//            }
//
//            if (Schema::hasColumn('producer_profiles', 'admin_address_id')) {
//                $table->dropForeign(['admin_address_id']);
//            }
//
//            if (Schema::hasColumn('producer_profiles', 'usina_address_id')) {
//                $table->dropForeign(['usina_address_id']);
//            }
//
//            if (Schema::hasColumn('producer_profiles', 'user_id')) {
//                $table->dropForeign(['user_id']);
//            }

            /*
            |--------------------------------------------------------------------------
            | REMOVER COLUNAS ANTIGAS
            |--------------------------------------------------------------------------
            */

            $columnsToDrop = [

                // ADMIN
                'admin_nome',
                'admin_qualificacao',
                'admin_address_id',
                'created_by_user_id',
                'user_id',

                // USINA
                'usina_nome',
                'usina_address_id',
                'usina_cnpj',

                // TÉCNICO
                'potencia_kw',
                'potencia_kwp',
                'geracao_anual',

                // IMÓVEL
                'unidade_consumidora',
                'usina_area',
                'imovel_area',
                'imovel_matricula',
                'tipo_area',
                'classificacao',

                // CONTRATO
                'prazo_locacao',
                'modulos',
                'inversores',
                'descricao',

                // FINANCEIRO
                'parcela_fixa',
                'taxa_administracao',
                'contrato_data',

                'created_at',
                'updated_at'
            ];

            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('producer_profiles', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        /*
        |--------------------------------------------------------------------------
        | ADICIONAR ESTRUTURA IGUAL CLIENT_PROFILE
        |--------------------------------------------------------------------------
        */

        Schema::table('producer_profiles', function (Blueprint $table) {

            // IDENTIFICAÇÃO

            if (!Schema::hasColumn('producer_profiles', 'tipo_pessoa')) {
                $table->enum('tipo_pessoa', ['pf', 'pj'])
                    ->default('pj')
                    ->after('status');
            }

            if (!Schema::hasColumn('producer_profiles', 'cpf')) {
                $table->string('cpf', 11)
                    ->nullable()
                    ->unique();
            }

            if (!Schema::hasColumn('producer_profiles', 'cnpj')) {
                $table->string('cnpj', 14)
                    ->nullable()
                    ->unique();
            }

            if (!Schema::hasColumn('producer_profiles', 'nome')) {
                $table->string('nome')->nullable();
            }

            if (!Schema::hasColumn('producer_profiles', 'razao_social')) {
                $table->string('razao_social')->nullable();
            }

            if (!Schema::hasColumn('producer_profiles', 'nome_fantasia')) {
                $table->string('nome_fantasia')->nullable();
            }

            // RELACIONAMENTOS

            if (!Schema::hasColumn('producer_profiles', 'consultor_user_id')) {
                $table->foreignId('consultor_user_id')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
            }
            if (!Schema::hasColumn('producer_profiles', 'platform_user_id')) {
                $table->foreignId('platform_user_id')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
            }

            // STATUS

            if (!Schema::hasColumn('producer_profiles', 'is_active_producer')) {
                $table->boolean('is_active_producer')
                    ->default(false);
            }

            if (!Schema::hasColumn('producer_profiles', 'activated_at')) {
                $table->timestamp('activated_at')
                    ->nullable();
            }

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | ÍNDICES
        |--------------------------------------------------------------------------
        */

        Schema::table('producer_profiles', function (Blueprint $table) {

            $table->index(
                ['tipo_pessoa', 'status'],
                'producer_profiles_tipo_status_index'
            );

            $table->index(
                ['consultor_user_id', 'status'],
                'producer_profiles_consultor_status_index'
            );
        });
    }

    private function dropForeignIfExists(
        string $table,
        string $foreignKey
    ): void {
        $database = DB::getDatabaseName();

        $exists = DB::table('information_schema.TABLE_CONSTRAINTS')
            ->where('TABLE_SCHEMA', $database)
            ->where('TABLE_NAME', $table)
            ->where('CONSTRAINT_NAME', $foreignKey)
            ->exists();

        if ($exists) {
            DB::statement("
                ALTER TABLE `$table`
                DROP FOREIGN KEY `$foreignKey`
            ");
        }
    }

    public function down(): void
    {
        Schema::table('producer_profiles', function (Blueprint $table) {

            if (Schema::hasColumn('producer_profiles', 'consultor_user_id')) {
                $table->dropForeign(['consultor_user_id']);
            }

            if (Schema::hasColumn('producer_profiles', 'platform_user_id')) {
                $table->dropForeign(['platform_user_id']);
            }

            $columns = [

                'producer_code',
                'tipo_pessoa',
                'cpf',
                'cnpj',
                'nome',
                'razao_social',
                'nome_fantasia',
                'email',
                'telefone',
                'consultor_user_id',
                'platform_user_id',
                'is_active_producer',
                'activated_at',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('producer_profiles', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
