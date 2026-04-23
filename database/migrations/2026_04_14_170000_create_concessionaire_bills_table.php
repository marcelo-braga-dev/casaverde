<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concessionaire_bills', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_profile_id')->constrained('client_profiles')->cascadeOnDelete();
            $table->foreignId('usina_id')->nullable()->constrained('usina_solars')->nullOnDelete();

            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('import_source')->default('manual');
            $table->string('concessionaria')->default('copel');

            $table->unsignedTinyInteger('reference_month');
            $table->unsignedSmallInteger('reference_year');
            $table->string('reference_label', 7);

            $table->string('unidade_consumidora');
            $table->string('numero_instalacao')->nullable();

            $table->date('vencimento');
            $table->decimal('valor_total', 12, 2);
            $table->decimal('consumo_kwh', 12, 2)->nullable();

            $table->string('pdf_disk')->default('local');
            $table->string('pdf_path');
            $table->string('pdf_original_name')->nullable();
            $table->text('pdf_url')->nullable();

            $table->longText('raw_text')->nullable();
            $table->json('extracted_payload')->nullable();

            $table->string('import_status')->default('manual');
            $table->string('review_status')->default('pending_review');
            $table->text('notes')->nullable();

            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();

            $table->unique(
                ['client_profile_id', 'unidade_consumidora', 'reference_label'],
                'concessionaire_bill_unique_ref'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concessionaire_bills');
    }
};