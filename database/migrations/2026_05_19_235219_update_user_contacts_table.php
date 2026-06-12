<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('user_contacts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);

            $table->dropColumn([
                'user_id',
            ]);
        });

        Schema::table('client_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'email',
                'telefone',
            ]);

            $table->foreignId('contacts_id')->nullable()->after('nome_fantasia')
                ->constrained('user_contacts')->nullOnDelete();
        });

        Schema::table('producer_profiles', function (Blueprint $table) {
            $table->foreignId('contacts_id')->nullable()->after('nome_fantasia')
                ->constrained('user_contacts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('user_contacts', function (Blueprint $table) {

        });
    }
};
