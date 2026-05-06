<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_webhook_events', function (Blueprint $table) {
            $table->id();

            $table->string('provider');
            $table->string('event_id')->nullable();
            $table->string('event_type')->nullable();

            $table->json('headers')->nullable();
            $table->json('payload');

            $table->string('status')->default('received'); // received, processed, ignored, failed
            $table->text('error_message')->nullable();

            $table->timestamp('processed_at')->nullable();

            $table->timestamps();

            $table->index(['provider', 'event_id'], 'idx_webhook_provider_event');
            $table->index(['status'], 'idx_webhook_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_webhook_events');
    }
};
