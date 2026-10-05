<?php

use App\Mail\Cliente\ChargePaymentMail;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Config\SystemSettingService;

// A demonstração e outras instalações usam a própria marca: "Casa Verde" não pode vir fixo.
describe('Nome da marca', function () {

    beforeEach(function () {
        app(SystemSettingService::class)->set('brand_name', 'Marca Teste');
    });

    it('uses the configured brand name, falling back to APP_NAME', function () {
        expect(app(SystemSettingService::class)->brandName())->toBe('Marca Teste');

        app(SystemSettingService::class)->set('brand_name', '');
        config(['app.name' => 'Outra Marca']);

        expect(app(SystemSettingService::class)->brandName())->toBe('Outra Marca');
    });

    it('shares the brand name with the frontend', function () {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.brand-identity.index'))
            ->assertInertia(fn ($page) => $page->where('brand.name', 'Marca Teste'));
    });

    it('renders the charge email with the brand name only', function () {
        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => CustomerCharge::factory()->create()->id,
        ]);

        $html = (new ChargePaymentMail($slip, ChargePaymentMail::AVAILABLE))->render();

        expect($html)->toContain('Marca Teste')->not->toContain('Casa Verde');
    });
});
