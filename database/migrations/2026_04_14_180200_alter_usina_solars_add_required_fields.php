<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            if (!Schema::hasColumn('usina_solars', 'consultor_user_id')) {
                $table->foreignId('consultor_user_id')
                    ->nullable()
                    ->after('user_id');

                $table->foreign('consultor_user_id', 'usina_consultor_fk')
                    ->references('id')
                    ->on('users')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('usina_solars', 'concessionaria_id')) {
                $table->foreignId('concessionaria_id')
                    ->nullable()
                    ->after('consultor_user_id');

                $table->foreign('concessionaria_id', 'usina_concessionaria_fk')
                    ->references('id')
                    ->on('concessionarias')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('usina_solars', 'address_id')) {
                $table->foreignId('address_id')
                    ->nullable()
                    ->after('usina_block_id');

                $table->foreign('address_id', 'usina_address_fk')
                    ->references('id')
                    ->on('addresses')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('usina_solars', 'uc')) {
                $table->string('uc')->nullable()->after('status');
            }

            if (!Schema::hasColumn('usina_solars', 'media_geracao')) {
                $table->decimal('media_geracao', 12, 2)->nullable();
            }

            if (!Schema::hasColumn('usina_solars', 'prazo_locacao')) {
                $table->integer('prazo_locacao')->nullable();
            }

            if (!Schema::hasColumn('usina_solars', 'potencia_usina')) {
                $table->decimal('potencia_usina', 12, 2)->nullable();
            }

            if (!Schema::hasColumn('usina_solars', 'taxa_comissao')) {
                $table->decimal('taxa_comissao', 8, 2)->nullable();
            }

            if (!Schema::hasColumn('usina_solars', 'inversores')) {
                $table->text('inversores')->nullable();
            }

            if (!Schema::hasColumn('usina_solars', 'modulos')) {
                $table->text('modulos')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            if (Schema::hasColumn('usina_solars', 'consultor_user_id')) {
                $table->dropForeign('usina_consultor_fk');
                $table->dropColumn('consultor_user_id');
            }

            if (Schema::hasColumn('usina_solars', 'concessionaria_id')) {
                $table->dropForeign('usina_concessionaria_fk');
                $table->dropColumn('concessionaria_id');
            }

            if (Schema::hasColumn('usina_solars', 'address_id')) {
                $table->dropForeign('usina_address_fk');
                $table->dropColumn('address_id');
            }

            $columns = [
                'uc',
                'media_geracao',
                'prazo_locacao',
                'potencia_usina',
                'taxa_comissao',
                'inversores',
                'modulos',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('usina_solars', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
