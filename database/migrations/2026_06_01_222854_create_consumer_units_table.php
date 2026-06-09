<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consumer_units', function (Blueprint $table) {
            $table->id();

            // Cliente dono da UC
            $table->foreignId('client_profile_id')
                ->constrained('client_profiles')
                ->cascadeOnDelete();

            // Código numérico da UC (ex: "4001234567")
            $table->string('uc_code', 30);

            // Nome amigável opcional (ex: "Casa Principal", "Empresa - Unidade 2")
            $table->string('label', 120)->nullable();

            // Concessionária responsável
            $table->foreignId('concessionaria_id')
                ->nullable()
                ->constrained('concessionarias')
                ->nullOnDelete();

            // Endereço da unidade consumidora
            $table->foreignId('address_id')
                ->nullable()
                ->constrained('addresses')
                ->nullOnDelete();

            $table->string('status')->default('active')
                ->comment('active | inactive | cancelled');

            $table->text('notes')->nullable();

            $table->timestamps();

            // Uma UC só pode ser única por cliente
            $table->unique(['client_profile_id', 'uc_code'], 'uc_client_unique');
            $table->index(['client_profile_id', 'status']);
        });

        // Adiciona consumer_unit_id em client_usina_links
        Schema::table('client_usina_links', function (Blueprint $table) {
            $table->foreignId('consumer_unit_id')
                ->nullable()
                ->after('client_profile_id')
                ->constrained('consumer_units')
                ->nullOnDelete()
                ->comment('UC específica vinculada a esta usina');
        });

        // Adiciona consumer_unit_id em client_contracts
        Schema::table('client_contracts', function (Blueprint $table) {
            $table->foreignId('consumer_unit_id')
                ->nullable()
                ->after('client_profile_id')
                ->constrained('consumer_units')
                ->nullOnDelete()
                ->comment('UC à qual este contrato está vinculado');
        });

        // Adiciona consumer_unit_id em concessionaire_bills
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            $table->foreignId('consumer_unit_id')
                ->nullable()
                ->after('client_profile_id')
                ->constrained('consumer_units')
                ->nullOnDelete()
                ->comment('UC a que esta fatura pertence');
        });
    }

    public function down(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            $table->dropForeign(['consumer_unit_id']);
            $table->dropColumn('consumer_unit_id');
        });

        Schema::table('client_contracts', function (Blueprint $table) {
            $table->dropForeign(['consumer_unit_id']);
            $table->dropColumn('consumer_unit_id');
        });

        Schema::table('client_usina_links', function (Blueprint $table) {
            $table->dropForeign(['consumer_unit_id']);
            $table->dropColumn('consumer_unit_id');
        });

        Schema::dropIfExists('consumer_units');
    }
};
