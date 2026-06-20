<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institutional_email_accounts', function (Blueprint $table) {
            $table->id();

            $table->string('email')->unique();
            $table->string('label')->nullable()->comment('Nome amigável para identificação');
            $table->longText('password')->nullable()->comment('Senha de acesso à conta de email (criptografada)');
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);

            $table->foreignId('created_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutional_email_accounts');
    }
};
