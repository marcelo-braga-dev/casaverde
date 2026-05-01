<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imported_concessionaire_emails', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_profile_id')->constrained('client_profiles')->cascadeOnDelete();
            $table->foreignId('client_email_import_setting_id');

            $table->foreign('client_email_import_setting_id', 'ic_emails_setting_fk')
                ->references('id')
                ->on('client_email_import_settings')
                ->cascadeOnDelete();

            $table->foreignId('concessionaire_bill_id')
                ->nullable()
                ->constrained('concessionaire_bills')
                ->nullOnDelete();

            $table->string('message_uid')->nullable();
            $table->string('message_id')->nullable();
            $table->string('from_email')->nullable();
            $table->string('subject')->nullable();
            $table->timestamp('received_at')->nullable();

            $table->string('attachment_name');
            $table->string('attachment_hash', 64)->nullable();

            $table->string('status')->default('processing');
            $table->text('error_message')->nullable();
            $table->timestamp('processed_at')->nullable();

            $table->timestamps();

            $table->index(['client_profile_id', 'status']);
            $table->index(['client_profile_id', 'message_uid'], 'ice_profile_uid_idx');
            $table->index(['client_profile_id', 'message_id'], 'ice_profile_msg_idx');
            $table->index(['client_profile_id', 'attachment_hash'], 'ice_profile_hash_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imported_concessionaire_emails');
    }
};
