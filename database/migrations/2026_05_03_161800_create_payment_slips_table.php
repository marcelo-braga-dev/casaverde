<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_slips', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_charge_id')
                ->constrained('customer_charges')
                ->cascadeOnDelete();

            $table->foreignId('payment_provider_account_id')
                ->nullable()
                ->constrained('payment_provider_accounts')
                ->nullOnDelete();

            $table->string('provider'); // cora, mercado_pago
            $table->string('provider_payment_id')->nullable();
            $table->string('provider_status')->nullable();

            $table->string('payment_method')->default('boleto_pix'); // boleto, pix, boleto_pix
            $table->string('status')->default('pending'); // pending, generated, paid, cancelled, failed, expired

            $table->decimal('amount', 12, 2);
            $table->date('due_date')->nullable();

            $table->string('barcode')->nullable();
            $table->string('digitable_line')->nullable();

            $table->text('pix_qr_code')->nullable();
            $table->text('pix_copy_paste')->nullable();

            $table->string('checkout_url')->nullable();
            $table->string('pdf_url')->nullable();

            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();

            $table->timestamp('generated_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            $table->text('error_message')->nullable();

            $table->timestamps();

            $table->index(['customer_charge_id', 'status'], 'idx_slip_charge_status');
            $table->index(['provider', 'provider_payment_id'], 'idx_slip_provider_payment');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_slips');
    }
};
