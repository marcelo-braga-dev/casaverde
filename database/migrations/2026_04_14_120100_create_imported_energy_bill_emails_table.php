<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imported_energy_bill_emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('client_email_import_setting_id');

            $table->foreign('client_email_import_setting_id', 'ieb_emails_setting_fk')
                ->references('id')
                ->on('client_email_import_settings')
                ->cascadeOnDelete();

            $table->string('message_uid')->nullable();
            $table->string('message_id')->nullable();
            $table->string('from_email')->nullable();
            $table->string('subject')->nullable();
            $table->timestamp('received_at')->nullable();

            $table->string('attachment_name');
            $table->string('attachment_hash', 64)->nullable();

            $table->string('status')->default('pending');
            $table->text('error_message')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'message_uid']);
            $table->index(['user_id', 'message_id']);
            $table->index(['user_id', 'attachment_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imported_energy_bill_emails');
    }
};
