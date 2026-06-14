<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('import_email_accounts', function (Blueprint $table) {
            $table->string('webmail_url')->nullable()->after('imap_password')
                ->comment('Domínio/URL do Roundcube para acesso rápido ao webmail');
        });
    }

    public function down(): void
    {
        Schema::table('import_email_accounts', function (Blueprint $table) {
            $table->dropColumn('webmail_url');
        });
    }
};
