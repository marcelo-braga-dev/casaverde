<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->foreignId('client_profile_id')->nullable()->after('id')->constrained('client_profiles')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('client_profile_id');
        });
    }
};