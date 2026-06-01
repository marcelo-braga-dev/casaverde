<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->foreignId('import_email_account_id')
                ->nullable()
                ->after('concessionaria_id')
                ->constrained('import_email_accounts')
                ->nullOnDelete()
                ->comment('Email do pool associado a esta configuração');
        });
    }

    public function down(): void
    {
        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->dropForeign(['import_email_account_id']);
            $table->dropColumn('import_email_account_id');
        });
    }
};
