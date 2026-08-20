<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Config\SystemSettingService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('DownloadPaymentSlipPdfController', function () {

    it('streams a pdf boleto with the configured brand logo embedded in the header', function () {
        Storage::fake('public');

        $path = UploadedFile::fake()->image('boleto-logo.png')->store('brand', 'public');
        app(SystemSettingService::class)->set('brand_boleto_logo_path', $path);

        $admin = User::factory()->admin()->create();
        $charge = CustomerCharge::factory()->create();

        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'mercado_pago',
            'payment_method' => 'boleto',
            'barcode' => str_repeat('1', 44),
            'digitable_line' => str_repeat('1', 47),
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.financeiro.pagamentos.boleto-pdf', $slip->id));

        $response->assertOk();
        expect($response->headers->get('content-type'))->toContain('application/pdf');
    });

    it('streams a pdf boleto for a mercado pago payment slip with barcode and digitable line', function () {
        $admin = User::factory()->admin()->create();
        $charge = CustomerCharge::factory()->create();

        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'mercado_pago',
            'payment_method' => 'boleto',
            'barcode' => str_repeat('1', 44),
            'digitable_line' => str_repeat('1', 47),
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.financeiro.pagamentos.boleto-pdf', $slip->id));

        $response->assertOk();
        expect($response->headers->get('content-type'))->toContain('application/pdf');
    });

    it('redirects back with a friendly error when the provider is not mercado pago', function () {
        $admin = User::factory()->admin()->create();
        $charge = CustomerCharge::factory()->create();

        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'cora',
            'barcode' => str_repeat('1', 44),
            'digitable_line' => str_repeat('1', 47),
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.financeiro.pagamentos.boleto-pdf', $slip->id));

        $response->assertRedirect();
        $response->assertSessionHas('error');
    });

    it('redirects back with a friendly error when barcode or digitable line are missing', function () {
        $admin = User::factory()->admin()->create();
        $charge = CustomerCharge::factory()->create();

        $slip = PaymentSlip::factory()->create([
            'customer_charge_id' => $charge->id,
            'provider' => 'mercado_pago',
            'payment_method' => 'pix',
            'barcode' => null,
            'digitable_line' => null,
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.financeiro.pagamentos.boleto-pdf', $slip->id));

        $response->assertRedirect();
        $response->assertSessionHas('error');
    });
});
