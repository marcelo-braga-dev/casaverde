<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            if (! Schema::hasColumn('usina_solars', 'energia_disponivel_kwh')) {
                $table->decimal('energia_disponivel_kwh', 14, 3)
                    ->default(0)
                    ->after('media_geracao');
            }

            if (! Schema::hasColumn('usina_solars', 'energia_alocada_kwh')) {
                $table->decimal('energia_alocada_kwh', 14, 3)
                    ->default(0)
                    ->after('energia_disponivel_kwh');
            }

            if (! Schema::hasColumn('usina_solars', 'energia_saldo_kwh')) {
                $table->decimal('energia_saldo_kwh', 14, 3)
                    ->default(0)
                    ->after('energia_alocada_kwh');
            }

            if (! Schema::hasColumn('usina_solars', 'operational_status')) {
                $table->string('operational_status', 50)
                    ->default('active')
                    ->after('status');
            }

            if (! Schema::hasColumn('usina_solars', 'operation_started_at')) {
                $table->date('operation_started_at')
                    ->nullable()
                    ->after('operational_status');
            }

            if (! Schema::hasColumn('usina_solars', 'admin_notes')) {
                $table->text('admin_notes')
                    ->nullable()
                    ->after('modulos');
            }
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $columns = [
                'energia_disponivel_kwh',
                'energia_alocada_kwh',
                'energia_saldo_kwh',
                'operational_status',
                'operation_started_at',
                'admin_notes',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('usina_solars', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
