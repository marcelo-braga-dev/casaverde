<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_provider_accounts', function (Blueprint $table) {
            $table->id();

            $table->string('provider'); // cora, mercado_pago, asaas
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);

            $table->string('environment')->default('sandbox'); // sandbox, production
            $table->string('base_url')->nullable();

            $table->string('client_id')->nullable();
            $table->text('client_secret')->nullable();

            $table->string('webhook_secret')->nullable();
            $table->json('settings')->nullable();

            $table->timestamps();

            $table->index(['provider', 'is_active'], 'idx_provider_active');
            $table->index(['provider', 'is_default'], 'idx_provider_default');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_provider_accounts');
    }
};
