<?php

use App\Http\Controllers\Auth\ProdutorActivationController;
use App\Http\Controllers\Webhook\Payments\CoraWebhookController;
use App\Http\Controllers\Webhook\Payments\MercadoPagoWebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/auth/index.php';
require __DIR__.'/admin/index.php';
require __DIR__.'/cliente/index.php';
require __DIR__.'/produtor/index.php';
require __DIR__.'/auth.php';
require __DIR__.'/user/index.php';
require __DIR__.'/consultor/index.php';

Route::post('/webhooks/payments/cora', CoraWebhookController::class)
    ->name('webhooks.payments.cora');

Route::post('/webhooks/payments/mercado-pago', MercadoPagoWebhookController::class)
    ->name('webhooks.payments.mercado-pago');

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'redirect.role'])->name('dashboard');

Route::get('/produtor/ativacao/{token}', [ProdutorActivationController::class, 'show'])
    ->name('produtor.activation.form');

Route::post('/produtor/ativacao', [ProdutorActivationController::class, 'store'])
    ->name('produtor.activation.store');
