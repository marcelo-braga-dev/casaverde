<?php

use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Services\Config\SystemSettingService;
use Carbon\CarbonImmutable;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// Código de barras Febraban válido cujo fator de vencimento aponta para daqui a $days dias.
function boletoBarcodeDueIn(int $days): string
{
    $factor = 1000 + (int) CarbonImmutable::parse('2025-02-22')->diffInDays(today()->addDays($days));

    return '34191'.$factor.str_repeat('1', 35);
}

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
            'barcode' => boletoBarcodeDueIn(10),
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
            'barcode' => boletoBarcodeDueIn(10),
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
            'barcode' => boletoBarcodeDueIn(10),
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

    it('refuses to hand out the pdf of a boleto the bank no longer accepts', function (string $status, int $dueInDays) {
        $admin = User::factory()->admin()->create();

        $slip = PaymentSlip::factory()->create([
            'provider' => 'mercado_pago',
            'payment_method' => 'boleto',
            'status' => $status,
            'barcode' => boletoBarcodeDueIn($dueInDays),
            'digitable_line' => str_repeat('1', 47),
        ]);

        $this->actingAs($admin)
            ->from(route('admin.financeiro.pagamentos.show', $slip->id))
            ->get(route('admin.financeiro.pagamentos.boleto-pdf', $slip->id))
            ->assertRedirect()
            ->assertSessionHas('error', fn ($message) => str_contains($message, 'vencido ou cancelado'));
    })->with([
        'marked expired' => ['expired', 10],
        'still generated but past the barcode due date' => ['generated', -1],
    ]);
});
