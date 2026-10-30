<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Usinas já existentes ficam com etapa nula (fora do quadro de onboarding): estão operando.
    public function up(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $table->string('onboarding_stage', 40)->nullable()->after('operational_status')->index();
            $table->timestamp('onboarding_stage_changed_at')->nullable()->after('onboarding_stage');
        });
    }

    public function down(): void
    {
        Schema::table('usina_solars', function (Blueprint $table) {
            $table->dropIndex(['onboarding_stage']);
            $table->dropColumn(['onboarding_stage', 'onboarding_stage_changed_at']);
        });
    }
};
