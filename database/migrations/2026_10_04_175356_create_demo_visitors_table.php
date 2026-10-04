<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Interessados que acessaram o modo demonstração (DEMO_MODE): contato para a equipe de vendas.
    public function up(): void
    {
        Schema::create('demo_visitors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('email')->nullable()->index();
            $table->string('phone', 20)->nullable()->index();
            $table->string('company', 120)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->unsignedInteger('visits')->default(1);
            $table->unsignedInteger('page_views')->default(0);
            $table->json('roles_viewed')->nullable();
            $table->string('last_role', 20)->nullable();
            $table->timestamp('first_seen_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_visitors');
    }
};
