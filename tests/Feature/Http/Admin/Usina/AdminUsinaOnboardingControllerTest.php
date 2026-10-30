<?php

use App\Enums\Usina\UsinaOnboardingStage;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use Database\Seeders\DemoUsinaOnboardingSeeder;
use Inertia\Testing\AssertableInertia as Assert;

describe('Quadro de onboarding de usinas', function () {

    beforeEach(function () {
        $this->admin = User::factory()->admin()->create();
    });

    it('shows usinas in progress and recently completed, hiding old and operating ones', function () {
        $produtor = ProducerProfile::factory()->create(['tipo_pessoa' => 'pf', 'nome' => 'Helena Martins Prado']);

        UsinaSolar::factory()->create([
            'usina_nome' => 'Usina em análise',
            'producer_profile_id' => $produtor->id,
            'onboarding_stage' => UsinaOnboardingStage::DocumentAnalysis,
            'onboarding_stage_changed_at' => now()->subDays(20),
        ]);
        UsinaSolar::factory()->create([
            'usina_nome' => 'Usina concluída agora',
            'onboarding_stage' => UsinaOnboardingStage::Completed,
            'onboarding_stage_changed_at' => now()->subDays(5),
        ]);
        UsinaSolar::factory()->create([
            'usina_nome' => 'Usina concluída há muito tempo',
            'onboarding_stage' => UsinaOnboardingStage::Completed,
            'onboarding_stage_changed_at' => now()->subDays(60),
        ]);
        UsinaSolar::factory()->create(['usina_nome' => 'Usina operando', 'onboarding_stage' => null]);

        $this->actingAs($this->admin)
            ->get(route('admin.usinas.onboarding.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Usina/Onboarding/Page')
                ->has('stages', 7)
                ->has('usinas', 2)
                ->where('usinas.0.usina_nome', 'Usina em análise')
                ->where('usinas.0.produtor', 'Helena Martins Prado')
                ->where('usinas.0.stage', 'document_analysis')
                ->where('usinas.0.days_in_stage', 20)
                ->where('usinas.1.usina_nome', 'Usina concluída agora')
                ->has('availableUsinas', 1)
                ->where('availableUsinas.0.usina_nome', 'Usina operando'));
    });

    it('moves a usina to another stage and restarts the stage clock', function () {
        $usina = UsinaSolar::factory()->create([
            'onboarding_stage' => UsinaOnboardingStage::DocumentAnalysis,
            'onboarding_stage_changed_at' => now()->subDays(10),
        ]);

        $this->actingAs($this->admin)
            ->patch(route('admin.usinas.onboarding.update', $usina), ['stage' => 'ownership_transfer'])
            ->assertRedirect()
            ->assertSessionHas('success');

        $usina->refresh();
        expect($usina->onboarding_stage)->toBe(UsinaOnboardingStage::OwnershipTransfer)
            ->and($usina->onboarding_stage_changed_at->isToday())->toBeTrue();
    });

    it('keeps the stage clock when the usina is dropped on the same stage', function () {
        $changedAt = now()->subDays(10)->startOfSecond();
        $usina = UsinaSolar::factory()->create([
            'onboarding_stage' => UsinaOnboardingStage::LeaseAgreement,
            'onboarding_stage_changed_at' => $changedAt,
        ]);

        $this->actingAs($this->admin)
            ->patch(route('admin.usinas.onboarding.update', $usina), ['stage' => 'lease_agreement'])
            ->assertRedirect();

        expect($usina->refresh()->onboarding_stage_changed_at->equalTo($changedAt))->toBeTrue();
    });

    it('puts an operating usina on the board', function () {
        $usina = UsinaSolar::factory()->create(['onboarding_stage' => null]);

        $this->actingAs($this->admin)
            ->patch(route('admin.usinas.onboarding.update', $usina), ['stage' => 'document_analysis'])
            ->assertRedirect();

        expect($usina->refresh()->onboarding_stage)->toBe(UsinaOnboardingStage::DocumentAnalysis);
    });

    it('rejects an unknown stage', function () {
        $usina = UsinaSolar::factory()->create(['onboarding_stage' => UsinaOnboardingStage::DocumentAnalysis]);

        $this->actingAs($this->admin)
            ->patch(route('admin.usinas.onboarding.update', $usina), ['stage' => 'analizar_documento'])
            ->assertSessionHasErrors('stage');

        expect($usina->refresh()->onboarding_stage)->toBe(UsinaOnboardingStage::DocumentAnalysis);
    });

    it('is restricted to admins', function (string $role) {
        $user = User::factory()->{$role}()->create();
        $usina = UsinaSolar::factory()->create(['onboarding_stage' => UsinaOnboardingStage::DocumentAnalysis]);

        $this->actingAs($user)->get(route('admin.usinas.onboarding.index'))->assertForbidden();
        $this->actingAs($user)
            ->patch(route('admin.usinas.onboarding.update', $usina), ['stage' => 'completed'])
            ->assertForbidden();

        expect($usina->refresh()->onboarding_stage)->toBe(UsinaOnboardingStage::DocumentAnalysis);
    })->with(['consultor', 'cliente', 'produtor']);

    // Sem inversores, módulos e média de geração: campos opcionais no formulário (já deram 500).
    it('starts a newly registered usina in document analysis', function () {
        $consultor = User::factory()->consultor()->create();
        $produtor = ProducerProfile::factory()->create();
        $concessionaria = Concessionaria::factory()->create();

        $this->actingAs($this->admin)
            ->post(route('consultor.producer.usinas.store'), [
                'producer_profile_id' => $produtor->id,
                'consultor_user_id' => $consultor->id,
                'concessionaria_id' => $concessionaria->id,
                'usina_nome' => 'Usina Nova do Quadro',
                'potencia_usina' => 500,
                'prazo_locacao' => 10,
                'address' => [],
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $usina = UsinaSolar::query()->where('usina_nome', 'Usina Nova do Quadro')->first();

        expect($usina)->not->toBeNull()
            ->and($usina->onboarding_stage)->toBe(UsinaOnboardingStage::DocumentAnalysis)
            ->and($usina->onboarding_stage_changed_at)->not->toBeNull();
    });

    it('seeds the demo board once, without duplicating on a second run', function () {
        User::factory()->consultor()->create();
        Concessionaria::factory()->create();
        ProducerProfile::factory()->count(3)->create();

        $this->seed(DemoUsinaOnboardingSeeder::class);
        $this->seed(DemoUsinaOnboardingSeeder::class);

        expect(UsinaSolar::query()->whereNotNull('onboarding_stage')->count())->toBe(6)
            ->and(UsinaSolar::query()->where('onboarding_stage', UsinaOnboardingStage::OwnershipTransfer)->value('energia_disponivel_kwh'))
            ->toEqual(0);
    });
});
