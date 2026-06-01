<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_email_accounts', function (Blueprint $table) {
            $table->id();

            // Endereço do email — único na plataforma
            $table->string('email')->unique();
            $table->string('label')->nullable()->comment('Nome amigável para identificação');

            // Senha do email no servidor IMAP (criptografada)
            $table->longText('imap_password')->nullable()->comment('Senha do email no servidor IMAP');

            // Filtros opcionais para esta conta
            $table->string('sender_filter')->nullable()->comment('Filtro de remetente (FROM)');
            $table->string('subject_filter')->nullable()->comment('Filtro de assunto (SUBJECT)');

            // Status e vínculo
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            // Vínculo com cliente — nullable (livre quando null)
            $table->foreignId('client_profile_id')
                ->nullable()
                ->constrained('client_profiles')
                ->nullOnDelete();

            $table->timestamp('assigned_at')->nullable()->comment('Quando foi vinculado ao cliente');

            $table->foreignId('created_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index(['is_active', 'client_profile_id'], 'import_email_active_client_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('import_email_accounts');
    }
};
