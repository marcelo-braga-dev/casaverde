<?php

namespace Database\Seeders;

use App\Models\Usina\Concessionaria;
use Illuminate\Database\Seeder;

/**
 * Preenche a tarifa GD (R$/kWh) das concessionárias que estão sem valor, para as propostas de
 * produtor da demonstração não saírem zeradas. Valores aproximados por estado; só toca em tarifa 0.
 *
 * Uso: php artisan db:seed --class=DemoTariffSeeder
 */
class DemoTariffSeeder extends Seeder
{
    private const BY_STATE = [
        'PR' => 0.78, 'MG' => 0.84, 'SP' => 0.76, 'RS' => 0.81, 'SC' => 0.72, 'GO' => 0.79,
        'MT' => 0.87, 'BA' => 0.82, 'CE' => 0.80, 'PE' => 0.79, 'RJ' => 0.89, 'PA' => 0.91,
        'MS' => 0.85, 'DF' => 0.74, 'ES' => 0.77, 'AM' => 0.88, 'MA' => 0.83, 'PB' => 0.75,
        'RN' => 0.76, 'AL' => 0.84, 'SE' => 0.73, 'PI' => 0.86, 'TO' => 0.88, 'RO' => 0.84,
        'AC' => 0.90, 'AP' => 0.78, 'RR' => 0.80,
    ];

    public function run(): void
    {
        $filled = 0;

        Concessionaria::withTrashed()
            ->where(fn ($q) => $q->whereNull('tarifa_gd2')->orWhere('tarifa_gd2', '<=', 0))
            ->each(function (Concessionaria $concessionaria) use (&$filled) {
                // Pequena variação por concessionária, para estados com várias não ficarem iguais.
                $base = self::BY_STATE[strtoupper((string) $concessionaria->estado)] ?? 0.80;
                $concessionaria->forceFill(['tarifa_gd2' => round($base + ($concessionaria->id % 5) * 0.01, 2)])->saveQuietly();
                $filled++;
            });

        $this->command?->line("  → Tarifas GD preenchidas: {$filled}");
    }
}
