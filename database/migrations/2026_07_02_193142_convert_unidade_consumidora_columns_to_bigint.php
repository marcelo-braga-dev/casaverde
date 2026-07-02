<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * UC é sempre um número inteiro (sem letras, pontuação ou zeros à
     * esquerda significativos). Antes de trocar o tipo da coluna para
     * BIGINT UNSIGNED, os dados existentes precisam estar 100% numéricos:
     * some registros têm zeros à esquerda (largura fixa de campo no PDF),
     * um registro órfão com valor '0' e um registro com duas UCs no mesmo
     * campo ("72170131/90689380") — mantém apenas a primeira.
     */
    public function up(): void
    {
        // MODIFY COLUMN e REGEXP são sintaxe MySQL — nos testes (SQLite
        // in-memory) essa migration não faz nada; os models já tratam o
        // campo como string via cast, então o comportamento da aplicação
        // não depende do tipo real da coluna.
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        // consumer_units.uc_code — remove órfão sem nenhum vínculo/fatura
        // (valor literal "0", resultado de um bug já corrigido no parser).
        DB::table('consumer_units')
            ->where('uc_code', '0')
            ->whereNotExists(function ($query) {
                $query->selectRaw(1)
                    ->from('concessionaire_bills')
                    ->whereColumn('concessionaire_bills.consumer_unit_id', 'consumer_units.id');
            })
            ->whereNotExists(function ($query) {
                $query->selectRaw(1)
                    ->from('client_usina_links')
                    ->whereColumn('client_usina_links.consumer_unit_id', 'consumer_units.id');
            })
            ->whereNotExists(function ($query) {
                $query->selectRaw(1)
                    ->from('client_contracts')
                    ->whereColumn('client_contracts.consumer_unit_id', 'consumer_units.id');
            })
            ->delete();

        $this->normalizeDigitsOnly('consumer_units', 'uc_code');
        $this->keepFirstUcOnly('commercial_proposals', 'unidade_consumidora');
        $this->normalizeDigitsOnly('commercial_proposals', 'unidade_consumidora');
        $this->normalizeDigitsOnly('cliente_propostas', 'unidade_consumidora');
        $this->normalizeDigitsOnly('concessionaire_bills', 'unidade_consumidora');
        $this->normalizeDigitsOnly('energy_bills', 'unidade_consumidora');
        $this->normalizeDigitsOnly('produtor_contratos', 'unidade_consumidora');

        DB::statement('ALTER TABLE consumer_units MODIFY uc_code BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE commercial_proposals MODIFY unidade_consumidora BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE cliente_propostas MODIFY unidade_consumidora BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE concessionaire_bills MODIFY unidade_consumidora BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE energy_bills MODIFY unidade_consumidora BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE produtor_contratos MODIFY unidade_consumidora BIGINT UNSIGNED NOT NULL');
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE consumer_units MODIFY uc_code VARCHAR(30) NOT NULL');
        DB::statement('ALTER TABLE commercial_proposals MODIFY unidade_consumidora VARCHAR(255) NULL');
        DB::statement('ALTER TABLE cliente_propostas MODIFY unidade_consumidora VARCHAR(255) NULL');
        DB::statement('ALTER TABLE concessionaire_bills MODIFY unidade_consumidora VARCHAR(255) NOT NULL');
        DB::statement('ALTER TABLE energy_bills MODIFY unidade_consumidora VARCHAR(255) NOT NULL');
        DB::statement('ALTER TABLE produtor_contratos MODIFY unidade_consumidora BIGINT NOT NULL');
    }

    /**
     * Mantém só a primeira UC quando o campo tem mais de um valor separado
     * por um caractere não numérico (ex: "72170131/90689380" -> "72170131").
     */
    private function keepFirstUcOnly(string $table, string $column): void
    {
        DB::table($table)
            ->whereNotNull($column)
            ->where($column, 'REGEXP', '[^0-9]')
            ->orderBy('id')
            ->get(['id', $column])
            ->each(function ($row) use ($table, $column) {
                preg_match('/^\s*(\d+)/', (string) $row->{$column}, $matches);
                DB::table($table)->where('id', $row->id)->update([
                    $column => $matches[1] ?? null,
                ]);
            });
    }

    private function normalizeDigitsOnly(string $table, string $column): void
    {
        DB::table($table)
            ->whereNotNull($column)
            ->where($column, '!=', '')
            ->orderBy('id')
            ->get(['id', $column])
            ->each(function ($row) use ($table, $column) {
                $normalized = ltrim(preg_replace('/\D+/', '', (string) $row->{$column}) ?? '', '0');

                DB::table($table)->where('id', $row->id)->update([
                    $column => $normalized !== '' ? $normalized : null,
                ]);
            });
    }
};
