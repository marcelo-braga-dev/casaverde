<?php

use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;
use App\Services\Pagamento\PaymentSlipExpiredAlertService;
use Inertia\Testing\AssertableInertia as Assert;

describe('OperationalAlertController', function () {

    it('shows a consultor only the alerts of its own portfolio', function () {
        $consultor = User::factory()->consultor()->create();
        $other = User::factory()->consultor()->create();

        $own = CustomerCharge::factory()->create([
            'client_profile_id' => ClientProfile::factory()->create(['consultor_user_id' => $consultor->id])->id,
        ]);
        $foreign = CustomerCharge::factory()->create([
            'client_profile_id' => ClientProfile::factory()->create(['consultor_user_id' => $other->id])->id,
        ]);

        app(PaymentSlipExpiredAlertService::class)->notify($own);
        app(PaymentSlipExpiredAlertService::class)->notify($foreign);

        $this->actingAs($consultor)
            ->get(route('admin.operational-alerts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('alerts.data', 1)
                ->where('alerts.data.0.payload.customer_charge_id', $own->id)
                ->where('summary.open', 1));
    });

    it('shows every alert to admins', function () {
        CustomerCharge::factory()->count(2)->create()->each(
            fn ($charge) => app(PaymentSlipExpiredAlertService::class)->notify($charge)
        );

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.operational-alerts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('alerts.data', 2));

        expect(OperationalAlert::count())->toBe(2);
    });
});
