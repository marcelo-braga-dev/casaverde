<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_contracts', function (Blueprint $table) {
            $table->id();

            $table->string('contract_code')->unique();

            $table->foreignId('commercial_proposal_id')
                ->constrained('commercial_proposals')
                ->cascadeOnDelete();

            $table->foreignId('client_profile_id')
                ->constrained('client_profiles')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('status')->default('issued');

            $table->date('issued_at')->nullable();
            $table->date('signed_at')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['client_profile_id', 'status']);
            $table->index(['commercial_proposal_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_contracts');
    }
};
