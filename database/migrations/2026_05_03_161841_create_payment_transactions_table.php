<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('payment_slip_id')
                ->constrained('payment_slips')
                ->cascadeOnDelete();

            $table->foreignId('customer_charge_id')
                ->constrained('customer_charges')
                ->cascadeOnDelete();

            $table->string('provider');
            $table->string('provider_transaction_id')->nullable();

            $table->decimal('amount', 12, 2);
            $table->timestamp('paid_at')->nullable();

            $table->string('status')->default('paid');
            $table->json('raw_payload')->nullable();

            $table->timestamps();

            $table->index(['customer_charge_id', 'status'], 'idx_payment_tx_charge_status');
            $table->index(['provider', 'provider_transaction_id'], 'idx_payment_tx_provider');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
