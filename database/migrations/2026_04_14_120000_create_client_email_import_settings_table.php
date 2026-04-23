<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_email_import_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('imap_host');
            $table->unsignedSmallInteger('imap_port')->default(993);
            $table->string('imap_encryption')->default('ssl');
            $table->string('imap_email');
            $table->longText('imap_password');
            $table->longText('pdf_password')->nullable();
            $table->string('sender_filter')->nullable();
            $table->string('subject_filter')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();

            $table->unique('user_id');
            $table->index(['imap_email', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_email_import_settings');
    }
};