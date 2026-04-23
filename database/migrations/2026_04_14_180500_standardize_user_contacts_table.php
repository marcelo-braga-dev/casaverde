<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_contacts', function (Blueprint $table) {
            if (!Schema::hasColumn('user_contacts', 'email')) {
                $table->string('email')->nullable();
            }
            if (!Schema::hasColumn('user_contacts', 'celular')) {
                $table->string('celular')->nullable();
            }
            if (!Schema::hasColumn('user_contacts', 'celular_2')) {
                $table->string('celular_2')->nullable();
            }
            if (!Schema::hasColumn('user_contacts', 'telefone')) {
                $table->string('telefone')->nullable();
            }
        });
    }

    public function down(): void
    {
        //
    }
};