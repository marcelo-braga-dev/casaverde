<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_webhook_events', function (Blueprint $table) {
            if (!Schema::hasColumn('payment_webhook_events', 'payment_slip_id')) {
                $table->foreignId('payment_slip_id')
                    ->nullable()
                    ->after('event_type')
                    ->constrained('payment_slips')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('payment_webhook_events', 'provider_payment_id')) {
                $table->string('provider_payment_id')
                    ->nullable()
                    ->after('payment_slip_id');
            }

            if (!Schema::hasColumn('payment_webhook_events', 'attempts')) {
                $table->unsignedInteger('attempts')
                    ->default(0)
                    ->after('status');
            }

            if (!Schema::hasColumn('payment_webhook_events', 'last_attempt_at')) {
                $table->timestamp('last_attempt_at')
                    ->nullable()
                    ->after('attempts');
            }

            $table->index(['provider', 'provider_payment_id'], 'idx_webhook_provider_payment');
            $table->index(['payment_slip_id', 'status'], 'idx_webhook_slip_status');
        });
    }

    public function down(): void
    {
        Schema::table('payment_webhook_events', function (Blueprint $table) {
            $table->dropIndex('idx_webhook_provider_payment');
            $table->dropIndex('idx_webhook_slip_status');

            if (Schema::hasColumn('payment_webhook_events', 'payment_slip_id')) {
                $table->dropConstrainedForeignId('payment_slip_id');
            }

            if (Schema::hasColumn('payment_webhook_events', 'provider_payment_id')) {
                $table->dropColumn('provider_payment_id');
            }

            if (Schema::hasColumn('payment_webhook_events', 'attempts')) {
                $table->dropColumn('attempts');
            }

            if (Schema::hasColumn('payment_webhook_events', 'last_attempt_at')) {
                $table->dropColumn('last_attempt_at');
            }
        });
    }
};
