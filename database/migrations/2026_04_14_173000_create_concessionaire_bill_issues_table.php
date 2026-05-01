<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concessionaire_bill_issues', function (Blueprint $table) {
            $table->id();

            $table->foreignId('concessionaire_bill_id')
                ->constrained('concessionaire_bills')
                ->cascadeOnDelete();

            $table->string('issue_code');
            $table->string('severity')->default('warning');
            $table->text('message');

            $table->boolean('is_resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('resolved_by_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['concessionaire_bill_id', 'is_resolved'], 'cbi_bill_resolved_idx');
            $table->index(['issue_code', 'severity']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concessionaire_bill_issues');
    }
};
