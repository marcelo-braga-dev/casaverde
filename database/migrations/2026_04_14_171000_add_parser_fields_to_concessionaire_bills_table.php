<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            $table->string('parser_status')->default('pending')->after('review_status');
            $table->text('parser_error')->nullable()->after('parser_status');
        });
    }

    public function down(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            $table->dropColumn(['parser_status', 'parser_error']);
        });
    }
};