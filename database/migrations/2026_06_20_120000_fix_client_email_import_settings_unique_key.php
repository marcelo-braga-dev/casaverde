<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropUnique('client_email_import_settings_user_id_unique');
        });

        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unique('client_profile_id');
        });
    }

    public function down(): void
    {
        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropUnique(['client_profile_id']);
        });

        Schema::table('client_email_import_settings', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unique('user_id');
        });
    }
};
