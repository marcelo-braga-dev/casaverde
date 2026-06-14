<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_usina_links', function (Blueprint $table) {
            if (! Schema::hasColumn('client_usina_links', 'allocated_energy_kwh')) {
                $table->decimal('allocated_energy_kwh', 14, 3)
                    ->default(0)
                    ->after('usina_id');
            }

            if (! Schema::hasColumn('client_usina_links', 'discount_percentage')) {
                $table->decimal('discount_percentage', 5, 2)
                    ->default(0)
                    ->after('allocated_energy_kwh');
            }

            if (! Schema::hasColumn('client_usina_links', 'status')) {
                $table->string('status', 50)
                    ->default('active')
                    ->after('is_active');
            }

            if (! Schema::hasColumn('client_usina_links', 'created_by_user_id')) {
                $table->foreignId('created_by_user_id')
                    ->nullable()
                    ->after('notes')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (! Schema::hasColumn('client_usina_links', 'updated_by_user_id')) {
                $table->foreignId('updated_by_user_id')
                    ->nullable()
                    ->after('created_by_user_id')
                    ->constrained('users')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('client_usina_links', function (Blueprint $table) {
            if (Schema::hasColumn('client_usina_links', 'created_by_user_id')) {
                $table->dropConstrainedForeignId('created_by_user_id');
            }

            if (Schema::hasColumn('client_usina_links', 'updated_by_user_id')) {
                $table->dropConstrainedForeignId('updated_by_user_id');
            }

            foreach (['allocated_energy_kwh', 'discount_percentage', 'status'] as $column) {
                if (Schema::hasColumn('client_usina_links', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
