<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client_profiles', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('producer_profiles', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('usina_solars', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('usina_blocks', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('user_contacts', function (Blueprint $table) {});
    }
};
