<?php

use App\src\Roles\RoleUser;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role_id')) {
                $table->unsignedBigInteger('role_id')->default(RoleUser::$CLIENTE)->after('password');
            }

            if (!Schema::hasColumn('users', 'consultor_id')) {
                $table->unsignedBigInteger('consultor_id')->nullable()->after('role_id');
            }

            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('1')->after('consultor_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'status')) {
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('users', 'consultor_id')) {
                $table->dropColumn('consultor_id');
            }

            if (Schema::hasColumn('users', 'role_id')) {
                $table->dropColumn('role_id');
            }
        });
    }
};