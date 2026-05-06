<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            if (!Schema::hasColumn('concessionaire_bills', 'nome')) {
                $table->string('nome')->nullable()->after('numero_instalacao');
            }

            if (!Schema::hasColumn('concessionaire_bills', 'review_notes')) {
                $table->text('review_notes')->nullable()->after('notes');
            }

            if (!Schema::hasColumn('concessionaire_bills', 'reviewed_by_id')) {
                $table->foreignId('reviewed_by_id')
                    ->nullable()
                    ->after('reviewed_by_user_id')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('concessionaire_bills', 'created_by_id')) {
                $table->foreignId('created_by_id')
                    ->nullable()
                    ->after('created_by_user_id')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('concessionaire_bills', 'parser_status')) {
                $table->string('parser_status')->default('pending')->after('review_status');
            }

            if (!Schema::hasColumn('concessionaire_bills', 'parser_error')) {
                $table->text('parser_error')->nullable()->after('parser_status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            if (Schema::hasColumn('concessionaire_bills', 'reviewed_by_id')) {
                $table->dropConstrainedForeignId('reviewed_by_id');
            }

            if (Schema::hasColumn('concessionaire_bills', 'created_by_id')) {
                $table->dropConstrainedForeignId('created_by_id');
            }

            if (Schema::hasColumn('concessionaire_bills', 'nome')) {
                $table->dropColumn('nome');
            }

            if (Schema::hasColumn('concessionaire_bills', 'review_notes')) {
                $table->dropColumn('review_notes');
            }

            if (Schema::hasColumn('concessionaire_bills', 'parser_status')) {
                $table->dropColumn('parser_status');
            }

            if (Schema::hasColumn('concessionaire_bills', 'parser_error')) {
                $table->dropColumn('parser_error');
            }
        });
    }
};
