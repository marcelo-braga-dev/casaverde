<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Resolve duplicidades existentes antes de criar o índice único:
        // mantém a concessionária no registro mais antigo de cada (concessionaria_id, uc_code)
        // e remove o vínculo (NULL) dos demais, sem apagar nenhum registro.
        $duplicates = DB::table('consumer_units')
            ->select('concessionaria_id', 'uc_code')
            ->whereNotNull('concessionaria_id')
            ->groupBy('concessionaria_id', 'uc_code')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $duplicate) {
            $ids = DB::table('consumer_units')
                ->where('concessionaria_id', $duplicate->concessionaria_id)
                ->where('uc_code', $duplicate->uc_code)
                ->orderBy('id')
                ->pluck('id')
                ->slice(1);

            DB::table('consumer_units')
                ->whereIn('id', $ids)
                ->update(['concessionaria_id' => null]);
        }

        Schema::table('consumer_units', function (Blueprint $table) {
            $table->unique(['concessionaria_id', 'uc_code'], 'uc_concessionaria_unique');
        });
    }

    public function down(): void
    {
        Schema::table('consumer_units', function (Blueprint $table) {
            $table->dropUnique('uc_concessionaria_unique');
        });
    }
};
