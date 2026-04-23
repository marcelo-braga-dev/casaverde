<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_access_invites', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_profile_id')->constrained('client_profiles')->cascadeOnDelete();
            $table->foreignId('created_by_user_id')->constrained('users')->cascadeOnDelete();

            $table->string('email');
            $table->string('token')->unique();

            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();

            $table->timestamps();

            $table->index(['client_profile_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_access_invites');
    }
};