<?php

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    // Services de pagamento falam com a API real do Mercado Pago: uma chamada sem
    // Http::fake() correspondente deve quebrar o teste, nunca sair para a rede.
    ->beforeEach(fn () => Http::preventStrayRequests())
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

/*
|--------------------------------------------------------------------------
| Mercado Pago helpers
|--------------------------------------------------------------------------
|
| Conta padrão ativa apontando para https://mp.test (sempre com Http::fake()) e um
| pedido da Orders API no formato que MercadoPagoPaymentProvider::mapResponse() lê.
|
*/

function mercadoPagoAccount(array $attributes = []): PaymentProviderAccount
{
    return PaymentProviderAccount::factory()->mercadoPago()->create([
        'base_url' => 'https://mp.test',
        'is_active' => true,
        'is_default' => true,
        ...$attributes,
    ]);
}

function mpOrder(string $id, string $status = 'action_required', array $extra = []): array
{
    $statusDetail = match ($status) {
        'processed' => 'accredited',
        'action_required' => 'waiting_payment',
        default => $status,
    };

    return array_merge(['id' => $id, 'status' => $status, 'status_detail' => $statusDetail], $extra);
}
