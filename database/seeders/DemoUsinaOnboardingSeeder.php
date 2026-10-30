<?php

namespace Database\Seeders;

use App\Enums\Usina\UsinaOnboardingStage;
use App\Enums\Usina\UsinaOperationalStatus;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use App\src\Roles\RoleUser;
use Illuminate\Database\Seeder;

/**
 * Usinas fictícias em onboarding, para o quadro de Onboarding de Usinas da demonstração não
 * ficar vazio (as usinas da base de marketing já estão operando). Pode rodar sozinho:
 * php83 artisan db:seed --class=DemoUsinaOnboardingSeeder --force
 */
class DemoUsinaOnboardingSeeder extends Seeder
{
    private const USINAS = [
        ['UFV Campo Alegre (fictícia)', 750, UsinaOnboardingStage::DocumentAnalysis, 3],
        ['UFV Serra Azul (fictícia)', 500, UsinaOnboardingStage::ContractSignature, 6],
        ['UFV Vale do Ivaí (fictícia)', 1000, UsinaOnboardingStage::RegistrationForm, 9],
        ['UFV Recanto do Sol (fictícia)', 375, UsinaOnboardingStage::LeaseAgreement, 4],
        ['UFV Água Clara (fictícia)', 900, UsinaOnboardingStage::OwnershipTransfer, 21],
        ['UFV Nova Aurora (fictícia)', 600, UsinaOnboardingStage::Completed, 2],
    ];

    public function run(): void
    {
        $alreadySeeded = UsinaSolar::query()
            ->whereIn('usina_nome', array_column(self::USINAS, 0))
            ->exists();

        $concessionaria = Concessionaria::query()->orderBy('id')->first();
        $consultor = User::query()->where('role_id', RoleUser::$CONSULTOR)->orderBy('id')->first();
        $produtores = ProducerProfile::query()->orderByDesc('id')->limit(count(self::USINAS))->get();

        if ($alreadySeeded || ! $concessionaria || ! $consultor || $produtores->isEmpty()) {
            return;
        }

        foreach (self::USINAS as $i => [$nome, $kwp, $stage, $diasNaEtapa]) {
            $produtor = $produtores[$i % $produtores->count()];

            UsinaSolar::query()->create([
                'usina_nome' => $nome,
                'producer_profile_id' => $produtor->id,
                'consultor_user_id' => $produtor->consultor_user_id ?: $consultor->id,
                'concessionaria_id' => $concessionaria->id,
                'status' => 'nova',
                'media_geracao' => $kwp * 120,
                'prazo_locacao' => 10,
                'potencia_usina' => $kwp,
                // Ainda sem clientes: energia zerada para não alterar os indicadores da operação.
                'energia_disponivel_kwh' => 0,
                'energia_alocada_kwh' => 0,
                'energia_saldo_kwh' => 0,
                'operational_status' => $stage === UsinaOnboardingStage::Completed
                    ? UsinaOperationalStatus::Active
                    : UsinaOperationalStatus::PendingDocumentation,
                'onboarding_stage' => $stage,
                'onboarding_stage_changed_at' => now()->subDays($diasNaEtapa),
            ]);
        }
    }
}
