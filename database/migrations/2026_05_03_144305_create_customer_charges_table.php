<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_charges', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_profile_id')
                ->constrained('client_profiles')
                ->cascadeOnDelete();

            $table->foreignId('platform_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('usina_id')
                ->nullable()
                ->constrained('usina_solars')
                ->nullOnDelete();

            $table->foreignId('concessionaria_id')
                ->nullable()
                ->constrained('concessionarias')
                ->nullOnDelete();

            $table->foreignId('concessionaire_bill_id')
                ->unique('uk_charge_bill')
                ->constrained('concessionaire_bills')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('reference_month');
            $table->unsignedSmallInteger('reference_year');
            $table->string('reference_label');

            $table->date('due_date')->nullable();

            $table->decimal('original_amount', 12, 2)->default(0);
            $table->decimal('discount_percent', 8, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('manual_discount_amount', 12, 2)->default(0);
            $table->decimal('manual_addition_amount', 12, 2)->default(0);
            $table->decimal('final_amount', 12, 2)->default(0);

            $table->string('status')->default('draft');

            $table->foreignId('generated_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('approved_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('approved_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(
                ['client_profile_id', 'reference_year', 'reference_month'],
                'idx_charges_client_ref'
            );

            $table->index('status', 'idx_charges_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_charges');
    }
};
