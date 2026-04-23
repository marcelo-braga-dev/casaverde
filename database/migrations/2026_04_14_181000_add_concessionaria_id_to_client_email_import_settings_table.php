<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->foreignId('concessionaria_id')
                ->nullable()
                ->after('client_profile_id')
                ->constrained('concessionarias')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('concessionaria_id');
        });
    }
};