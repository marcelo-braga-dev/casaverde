<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->normalizeConsumerUnitCodes();
        $this->backfillBillConsumerUnits();

        // Sem unique: importações podem gerar faturas duplicadas (mesma UC e
        // referência), e ValidateConcessionaireBillService sinaliza esses casos
        // via issue 'duplicate_reference' para revisão manual.
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            $table->index(['consumer_unit_id', 'reference_label'], 'concessionaire_bills_consumer_unit_reference_index');
        });
    }

    public function down(): void
    {
        Schema::table('concessionaire_bills', function (Blueprint $table) {
            $table->dropIndex('concessionaire_bills_consumer_unit_reference_index');
        });
    }

    /**
     * Normaliza consumer_units.uc_code para conter apenas dígitos,
     * para casar com o formato extraído pelo parser de faturas.
     */
    private function normalizeConsumerUnitCodes(): void
    {
        $units = DB::table('consumer_units')->get(['id', 'client_profile_id', 'uc_code']);

        foreach ($units as $unit) {
            $normalized = preg_replace('/\D+/', '', (string) $unit->uc_code);

            if ($normalized === '' || $normalized === $unit->uc_code) {
                continue;
            }

            $conflict = DB::table('consumer_units')
                ->where('client_profile_id', $unit->client_profile_id)
                ->where('uc_code', $normalized)
                ->where('id', '!=', $unit->id)
                ->exists();

            if ($conflict) {
                continue;
            }

            DB::table('consumer_units')->where('id', $unit->id)->update(['uc_code' => $normalized]);
        }
    }

    /**
     * Para faturas existentes sem consumer_unit_id, localiza (ou cria) a UC do
     * cliente correspondente ao código extraído da fatura e vincula a fatura a ela.
     */
    private function backfillBillConsumerUnits(): void
    {
        $bills = DB::table('concessionaire_bills')
            ->whereNull('consumer_unit_id')
            ->whereNotNull('unidade_consumidora')
            ->where('unidade_consumidora', '!=', '')
            ->get(['id', 'client_profile_id', 'unidade_consumidora']);

        foreach ($bills as $bill) {
            $code = preg_replace('/\D+/', '', (string) $bill->unidade_consumidora);

            if ($code === '') {
                continue;
            }

            $unit = DB::table('consumer_units')
                ->where('client_profile_id', $bill->client_profile_id)
                ->where('uc_code', $code)
                ->first();

            $unitId = $unit->id ?? DB::table('consumer_units')->insertGetId([
                'client_profile_id' => $bill->client_profile_id,
                'uc_code' => $code,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('concessionaire_bills')->where('id', $bill->id)->update(['consumer_unit_id' => $unitId]);
        }
    }
};
