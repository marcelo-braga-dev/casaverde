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
        Schema::create('customer_charge_adjustments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_charge_id')->constrained('customer_charges')->cascadeOnDelete();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('type'); // discount, addition
            $table->decimal('amount', 12, 2);
            $table->string('description')->nullable();

            $table->timestamps();

            $table->index(['customer_charge_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_charge_adjustments');
    }
};
