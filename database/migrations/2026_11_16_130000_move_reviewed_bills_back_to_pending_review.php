<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    // O status "reviewed" foi extinto: "Salvar revisão" não gerava cobrança e as faturas paravam
    // ali. Elas voltam para a fila de revisão para serem aprovadas. "corrected" fica como legado.
    public function up(): void
    {
        DB::table('concessionaire_bills')
            ->where('review_status', 'reviewed')
            ->update(['review_status' => 'pending_review', 'updated_at' => now()]);

        DB::table('operational_alerts')
            ->where('type', 'bills_reviewed_not_approved')
            ->whereIn('status', ['open', 'in_progress', 'ignored'])
            ->update([
                'status' => 'resolved',
                'resolved_at' => now(),
                'resolution_notes' => 'Status "Revisada" extinto: as faturas voltaram para "Aguardando revisão".',
            ]);
    }

    public function down(): void {}
};
