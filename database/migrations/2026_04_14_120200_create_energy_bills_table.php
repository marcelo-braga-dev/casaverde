<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('energy_bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->foreignId('imported_email_id')
                ->nullable()
                ->constrained('imported_energy_bill_emails')
                ->nullOnDelete();

            $table->string('concessionaria')->nullable();
            $table->string('unidade_consumidora')->index();
            $table->string('referencia', 7)->index(); // MM/AAAA
            $table->date('vencimento');
            $table->decimal('total_pagar', 12, 2);
            $table->decimal('consumo_kwh', 12, 2)->nullable();

            $table->string('pdf_disk')->default('local');
            $table->string('pdf_path');
            $table->string('pdf_original_name')->nullable();
            $table->text('pdf_url')->nullable();

            $table->longText('raw_text')->nullable();
            $table->json('parser_payload')->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'unidade_consumidora', 'referencia'], 'energy_bill_unique_ref');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('energy_bills');
    }
};